import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { get, startCase } from 'lodash';
import PropTypes from 'constants/propTypes';
import Placeholder from 'components/Placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import {
  statusColorNames as operatorStatusColorNames,
  statusesLabels as operatorStatusesLabels,
  operatorTypes,
} from 'constants/operators';
import permissions from 'config/permissions';
import Uuid from 'components/Uuid';
import Grid, { GridColumn } from 'components/Grid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import PermissionContent from 'components/PermissionContent';
import { authoritiesOptionsQuery } from 'graphql/queries/auth';
import MiniProfile from 'components/MiniProfile';
import { getUserTypeByDepartment } from './utils';
import OperatorGridFilter from './OperatorGridFilter';

const EMAIL_ALREADY_EXIST = 'error.validation.email.exists';

class List extends Component {
  static propTypes = {
    ...PropTypes.router,
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
    operators: PropTypes.shape({
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.any),
      }),
      loadMore: PropTypes.func,
      loading: PropTypes.bool.isRequired,
    }),
    operatorType: PropTypes.string,
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
      this.props.history.replace({
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
      notify,
    } = this.props;
    const userType = getUserTypeByDepartment(department, role);
    const operatorType = this.props.operatorType.toLowerCase();

    try {
      const {
        data: operatorData,
      } = await submitNewOperator({
        variables: { ...data, userType, department, role, email, branchId: branch },
      });

      const newOperator = get(operatorData, `${operatorType}.create${startCase(operatorType)}.data`);
      const newOperatorError = get(operatorData, `${operatorType}.create${startCase(operatorType)}.error`);
      const error = get(newOperatorError, 'error', null);

      if (error === EMAIL_ALREADY_EXIST) {
        createOperator.hide();
        existingOperator.show({
          department,
          role,
          branchId: branch,
          email,
        });

        return;
      }
      createOperator.hide();

      const { uuid } = newOperator;

      this.props.history.push(`/${operatorType.toLowerCase()}s/${uuid}/profile`);
    } catch (e) {
      createOperator.hide();
      notify({
        level: 'error',
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleOpenCreateModal = async () => {
    const { modals, notify, client } = this.props;

    const {
      data: {
        authoritiesOptions: {
          data: {
            post: {
              departmentRole,
            },
          },
          error,
        },
      },
    } = await client.query({ query: authoritiesOptionsQuery });

    if (!error) {
      delete departmentRole.PLAYER;
      delete departmentRole.AFFILIATE_PARTNER;

      const [department] = Object.keys(departmentRole);

      const initialValues = {
        department,
        role: department ? departmentRole[department][0] : null,
      };

      modals.createOperator.show({
        onSubmit: this.handleSubmitNewOperator,
        initialValues,
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
        data.statusChangeDate
        && (
          <div className="font-size-11">
            {I18n.t('COMMON.SINCE', { date: moment.utc(data.statusChangeDate).local().format('DD.MM.YYYY') })}
          </div>
        )
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
          type="operator"
          id={uuid}
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
              type="button"
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
          <Grid
            data={entities.content}
            handlePageChanged={this.handlePageChanged}
            isLoading={loading}
            isLastPage={entities.last}
            withLazyLoad
            withNoResults={!loading && entities.content.length === 0}
          >
            <GridColumn
              name="uuid"
              header={I18n.t('OPERATORS.GRID_HEADER.OPERATOR')}
              render={this.renderOperator}
            />
            <GridColumn
              name="country"
              header={I18n.t('OPERATORS.GRID_HEADER.COUNTRY')}
              render={this.renderCountry}
            />
            <GridColumn
              name="registered"
              header={I18n.t('OPERATORS.GRID_HEADER.REGISTERED')}
              render={this.renderRegistered}
            />
            <GridColumn
              name="status"
              header={I18n.t('OPERATORS.GRID_HEADER.STATUS')}
              render={this.renderStatus}
            />
          </Grid>
        </div>
      </div>
    );
  }
}

export default List;
