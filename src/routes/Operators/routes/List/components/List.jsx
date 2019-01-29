import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import Placeholder from 'components/Placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import history from '../../../../../router/history';
import {
  statusColorNames as operatorStatusColorNames,
  statusesLabels as operatorStatusesLabels,
} from '../../../../../constants/operators';
import { types as miniProfileTypes } from '../../../../../constants/miniProfile';
import Uuid from '../../../../../components/Uuid';
import MiniProfile from '../../../../../components/MiniProfile';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import CountryLabelWithFlag from '../../../../../components/CountryLabelWithFlag';
import delay from '../../../../../utils/delay';
import parseErrorsFromServer from '../../../../../utils/parseErrorsFromServer';
import { getUserTypeByDepartment } from './utils';
import OperatorGridFilter from './OperatorGridFilter';

class List extends Component {
  static propTypes = {
    modals: PropTypes.shape({
      createOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    onSubmitNewOperator: PropTypes.func.isRequired,
    filterValues: PropTypes.object,
    locale: PropTypes.string.isRequired,
    fetchOperatorMiniProfile: PropTypes.func.isRequired,
    addAuthority: PropTypes.func.isRequired,
    fetchAuthorities: PropTypes.func.isRequired,
    fetchAuthoritiesOptions: PropTypes.func.isRequired,
    operators: PropTypes.shape({
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.any),
      }),
      loadMore: PropTypes.func,
      loading: PropTypes.bool.isRequired,
    }),
  };
  static defaultProps = {
    filterValues: null,
    operators: {
      operators: {},
      loading: false,
    },
  };

  state = {
    filters: {},
  };

  pollAuthorities = async (uuid, retryCount = 3) => {
    const authoritiesAction = await this.props.fetchAuthorities(uuid);

    const nextRetryCount = retryCount - 1;
    if (authoritiesAction.error && nextRetryCount > 0) {
      await delay(1000 * (3 - nextRetryCount));

      return this.pollAuthorities(uuid, nextRetryCount);
    }

    return !authoritiesAction.error;
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

  handleSubmitNewOperator = async ({ department, role, branch, ...data }) => {
    const {
      onSubmitNewOperator,
      modals: { createOperator },
      addAuthority,
      notify,
      createHierarchyUser,
    } = this.props;

    const action = await onSubmitNewOperator({ ...data, department, role });
    const submitErrors = get(action.payload, 'response.fields_errors', null);

    if (submitErrors) {
      const errors = parseErrorsFromServer(submitErrors);
      throw new SubmissionError(errors);
    }
    createOperator.hide();

    const { uuid } = action.payload;
    const hasAuthorities = await this.pollAuthorities(uuid);

    if (!hasAuthorities) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.GET_OPERATORS_AUTHORITIES_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.GET_OPERATORS_AUTHORITIES_ERROR.MESSAGE'),
      });
    }

    const addAuthorityAction = await addAuthority(uuid, department, role);

    if (addAuthorityAction.error) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.MESSAGE'),
      });
    }

    const userType = getUserTypeByDepartment(department, role);
    const { data: { hierarchy: { createUser: { error } } } } = await createHierarchyUser({
      variables: {
        userId: uuid,
        userType,
        ...branch && { branchId: branch },
      },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.ADD_TO_HIERARCHY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.ADD_TO_HIERARCHY_ERROR.MESSAGE'),
      });
    }

    history.push(`/operators/${uuid}/profile`);
  };

  handleOpenCreateModal = async () => {
    const { fetchAuthoritiesOptions, modals, notify, operatorId } = this.props;
    const optionsAction = await fetchAuthoritiesOptions();

    if (!optionsAction.error) {
      const { departmentRole } = optionsAction.payload.post;

      delete departmentRole.PLAYER;

      const [department] = Object.keys(departmentRole);

      modals.createOperator.show({
        onSubmit: this.handleSubmitNewOperator,
        initialValues: {
          department,
          role: department ? departmentRole[department][0] : null,
          sendMail: true,
        },
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
        {operatorStatusesLabels[data.operatorStatus] || data.operatorStatus}
      </div>
      {
        data.statusChangeDate &&
        <div className="font-size-11">
          {I18n.t('COMMON.SINCE', { date: moment.utc(data.statusChangeDate).local().format('DD.MM.YYYY') })}
        </div>
      }
    </div>
  );

  renderOperator = data => (
    <div>
      <div className="font-weight-700" id={`operator-list-${data.uuid}-main`}>
        <Link to={`/operators/${data.uuid}/profile`}>{data.fullName}</Link>
      </div>
      <div className="font-size-11" id={`operator-list-${data.uuid}-additional`}>
        <MiniProfile
          target={data.uuid}
          type={miniProfileTypes.OPERATOR}
          dataSource={this.handleLoadOperatorMiniProfile}
        >
          <Uuid uuid={data.uuid} />
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
    } = this.props;

    const entities = get(operators, 'operators.data', { content: [] });

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
                    {I18n.t('COMMON.OPERATORS_FOUND')}
                  </div>
                </span>
              </When>
              <Otherwise>
                <span className="font-size-20">
                  {I18n.t('OPERATORS.HEADING')}
                </span>
              </Otherwise>
            </Choose>
          </Placeholder>

          <button
            className="btn btn-default-outline ml-auto"
            onClick={this.handleOpenCreateModal}
            id="create-new-operator-button"
          >
            {I18n.t('OPERATORS.CREATE_OPERATOR_BUTTON')}
          </button>
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
              header="Operator"
              render={this.renderOperator}
            />
            <GridViewColumn
              name="country"
              header="Country"
              render={this.renderCountry}
            />
            <GridViewColumn
              name="registered"
              header="Registered"
              render={this.renderRegistered}
            />
            <GridViewColumn
              name="status"
              header="Status"
              render={this.renderStatus}
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default List;
