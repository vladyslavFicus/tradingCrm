import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { get, startCase } from 'lodash';
import Placeholder from 'components/Placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import history from 'router/history';
import {
  statusColorNames as operatorStatusColorNames,
  statusesLabels as operatorStatusesLabels,
  operatorTypes,
} from 'constants/operators';
import permissions from 'config/permissions';
import { types as miniProfileTypes } from 'constants/miniProfile';
import Uuid from 'components/Uuid';
import MiniProfile from 'components/MiniProfile';
import GridView, { GridViewColumn } from 'components/GridView';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import PermissionContent from 'components/PermissionContent';
import parseErrorsFromServer from 'utils/parseErrorsFromServer';
import { getUserTypeByDepartment } from './utils';
import OperatorGridFilter from './OperatorGridFilter';

const EMAIL_ALREADY_EXIST = 'Email already exists';

class List extends Component {
  static propTypes = {
    modals: PropTypes.shape({
      createOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
      existingOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    submitNewOperator: PropTypes.func.isRequired,
    filterValues: PropTypes.object,
    locale: PropTypes.string.isRequired,
    fetchOperatorMiniProfile: PropTypes.func.isRequired,
    fetchAuthorities: PropTypes.func.isRequired,
    fetchAuthoritiesOptions: PropTypes.func.isRequired,
    operators: PropTypes.shape({
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.any),
      }),
      loadMore: PropTypes.func,
      loading: PropTypes.bool.isRequired,
    }),
    operatorType: PropTypes.string,
    operatorId: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    filterValues: null,
    operators: {
      operators: {},
      loading: false,
    },
    operatorType: operatorTypes.OPERATOR,
  };

  state = {
    filters: {},
  };

  handlePageChanged = () => {
    const {
      operators: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters }, () => {
      history.replace({
        query: {
          filters: {
            ...filters,
          },
        },
      });
    });
  };

  handleSubmitNewOperator = async ({ department, role, branch, email, ...data }) => {
    const {
      modals: {
        createOperator,
        existingOperator,
      },
      submitNewOperator,
    } = this.props;
    const userType = getUserTypeByDepartment(department, role);
    const operatorType = this.props.operatorType.toLowerCase();

    const {
      data: operatorData,
    } = await submitNewOperator({ variables: { ...data, department, role, email, userType, branchId: branch } });

    const newOperator = get(operatorData, `${operatorType}.create${startCase(operatorType)}.data`);
    const newOperatorError = get(operatorData, `${operatorType}.create${startCase(operatorType)}.error`);
    const submitErrors = get(newOperatorError, 'fields_errors', null);

    if (submitErrors) {
      const errors = parseErrorsFromServer(submitErrors);

      if (errors.email && errors.email === EMAIL_ALREADY_EXIST) {
        createOperator.hide();
        existingOperator.show({
          department,
          role,
          branchId: branch,
          email,
        });
      }

      throw new SubmissionError(errors);
    }
    createOperator.hide();

    const { uuid } = newOperator;

    history.push(`/${operatorType.toLowerCase()}s/${uuid}/profile`);
  };

  handleOpenCreateModal = async () => {
    const { fetchAuthoritiesOptions, modals, notify, operatorId } = this.props;
    const optionsAction = await fetchAuthoritiesOptions();

    if (!optionsAction.error) {
      const { departmentRole } = optionsAction.payload.post;

      delete departmentRole.PLAYER;
      delete departmentRole.AFFILIATE_PARTNER;

      const [department] = Object.keys(departmentRole);

      const initialValues = {
        department,
        role: department ? departmentRole[department][0] : null,
        sendMail: true,
      };

      modals.createOperator.show({
        onSubmit: this.handleSubmitNewOperator,
        initialValues,
        operatorId,
        departmentsRoles: departmentRole || {},
      });
    } else {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.GET_AUTHORITIES_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.GET_AUTHORITIES_ERROR.MESSAGE'),
      });
    }
  };

  handleLoadOperatorMiniProfile = async (uuid) => {
    const { fetchOperatorMiniProfile, fetchAuthorities } = this.props;

    const action = await fetchOperatorMiniProfile(uuid);

    if (!action || action.error) {
      return {
        error: true,
        payload: action ? action.payload : null,
      };
    }

    const payload = { ...action.payload };

    const authoritiesAction = await fetchAuthorities(uuid);

    if (!authoritiesAction || authoritiesAction.error) {
      return {
        error: true,
        payload: authoritiesAction ? authoritiesAction.payload : null,
      };
    }

    payload.authorities = authoritiesAction.payload;

    return {
      error: false,
      payload,
    };
  };

  renderStatus = data => (
    <div>
      <div
        className={
          classNames(operatorStatusColorNames[data.operatorStatus], 'text-uppercase font-weight-700')
        }
      >
        {I18n.t(operatorStatusesLabels[data.operatorStatus]) || data.operatorStatus}
      </div>
      {
        data.statusChangeDate &&
        <div className="font-size-11">
          {I18n.t('COMMON.SINCE', { date: moment.utc(data.statusChangeDate).local().format('DD.MM.YYYY') })}
        </div>
      }
    </div>
  );

  renderOperator = ({ uuid, fullName }) => (
    <div>
      <div className="font-weight-700" id={`operator-list-${uuid}-main`}>
        <Link to={`/${this.props.operatorType.toLowerCase()}s/${uuid}/profile`}>{fullName}</Link>
      </div>
      <div className="font-size-11" id={`operator-list-${uuid}-additional`}>
        <MiniProfile
          target={uuid}
          type={miniProfileTypes.OPERATOR}
          dataSource={this.handleLoadOperatorMiniProfile}
        >
          <Uuid uuid={uuid} />
        </MiniProfile>
      </div>
    </div>
  );

  renderCountry = ({ country }) => (
    <Choose>
      <When condition={country}>
        <CountryLabelWithFlag
          code={country}
          height="14"
        />
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderRegistered = data => (
    <div>
      <div className="font-weight-700">
        {moment.utc(data.registrationDate).local().format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment.utc(data.registrationDate).local().format('HH:mm')}
      </div>
    </div>
  );

  render() {
    const { filters } = this.state;
    const {
      operators,
      operators: { loading },
      filterValues,
      locale,
      operatorType,
    } = this.props;

    const entities = get(operators, 'operators.data') || { content: [] };

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading && !!operators}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <Choose>
              <When condition={!!entities.totalElements}>
                <span className="font-size-20 height-55">
                  <div>
                    <strong>{entities.totalElements} </strong>
                    {I18n.t(`COMMON.${operatorType}S_FOUND`)}
                  </div>
                </span>
              </When>
              <Otherwise>
                <span className="font-size-20">
                  {I18n.t(`${operatorType}S.HEADING`)}
                </span>
              </Otherwise>
            </Choose>
          </Placeholder>
          <PermissionContent permissions={permissions.OPERATORS.CREATE}>
            <button
              className="btn btn-default-outline ml-auto"
              onClick={this.handleOpenCreateModal}
              id="create-new-operator-button"
            >
              {I18n.t(`${operatorType}S.CREATE_OPERATOR_BUTTON`)}
            </button>
          </PermissionContent>
        </div>

        <OperatorGridFilter
          onSubmit={this.handleFiltersChanged}
          initialValues={filters}
          filterValues={filterValues}
        />

        <div className="card-body">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.page}
            last={entities.last}
            lazyLoad
            locale={locale}
            showNoResults={!loading && entities.content.length === 0}
            loading={loading}
          >
            <GridViewColumn
              name="uuid"
              header={I18n.t('OPERATORS.GRID_HEADER.OPERATOR')}
              render={this.renderOperator}
            />
            <GridViewColumn
              name="country"
              header={I18n.t('OPERATORS.GRID_HEADER.COUNTRY')}
              render={this.renderCountry}
            />
            <GridViewColumn
              name="registered"
              header={I18n.t('OPERATORS.GRID_HEADER.REGISTERED')}
              render={this.renderRegistered}
            />
            <GridViewColumn
              name="status"
              header={I18n.t('OPERATORS.GRID_HEADER.STATUS')}
              render={this.renderStatus}
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default List;
