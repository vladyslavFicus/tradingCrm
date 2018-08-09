import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import history from '../../../../../router/history';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import OperatorGridFilter from './OperatorGridFilter';
import {
  statusColorNames as operatorStatusColorNames,
  statusesLabels as operatorStatusesLabels,
} from '../../../../../constants/operators';
import Uuid from '../../../../../components/Uuid';
import MiniProfile from '../../../../../components/MiniProfile';
import { types as miniProfileTypes } from '../../../../../constants/miniProfile';
import delay from '../../../../../utils/delay';

class List extends Component {
  static propTypes = {
    modals: PropTypes.shape({
      createOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    isLoading: PropTypes.bool,
    onSubmitNewOperator: PropTypes.func.isRequired,
    fetchEntities: PropTypes.func.isRequired,
    filterValues: PropTypes.object,
    list: PropTypes.object,
    locale: PropTypes.string.isRequired,
    fetchOperatorMiniProfile: PropTypes.func.isRequired,
    addAuthority: PropTypes.func.isRequired,
    fetchAuthorities: PropTypes.func.isRequired,
    fetchAuthoritiesOptions: PropTypes.func.isRequired,
  };
  static defaultProps = {
    filterValues: null,
    list: null,
  };

  state = {
    filters: {},
    page: 0,
  };

  componentWillMount() {
    this.handleRefresh();
  }

  pollAuthorities = async (uuid, retryCount = 3) => {
    const authoritiesAction = await this.props.fetchAuthorities(uuid);

    const nextRetryCount = retryCount - 1;
    if (authoritiesAction.error && nextRetryCount > 0) {
      await delay(1000 * (3 - nextRetryCount));

      return this.pollAuthorities(uuid, nextRetryCount);
    }

    return !authoritiesAction.error;
  };

  handlePageChanged = (page) => {
    if (!this.props.list.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleRefresh = () => this.props.fetchEntities({
    ...this.state.filters,
    page: this.state.page,
  });

  handleFiltersChanged = (filters = {}) => {
    console.info('Operators search: Filter submitted');

    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handleSubmitNewOperator = async ({ department, role, ...data }) => {
    const {
      onSubmitNewOperator, modals, addAuthority, notify,
    } = this.props;
    const action = await onSubmitNewOperator({ ...data, department, role });

    if (action.error) {
      throw new SubmissionError({ __error: action.payload });
    }

    modals.createOperator.hide();

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

    history.push(`/operators/${uuid}/profile`);
  };

  handleOpenCreateModal = async () => {
    const { fetchAuthoritiesOptions, modals, notify } = this.props;
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
        <Link to={`/operators/${data.uuid}/profile`}>
          {[data.firstName, data.lastName].join(' ')}
        </Link>
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

  renderCountry = (data) => {
    if (!data.country) {
      return data.country;
    }

    return <i className={`fs-icon fs-${data.country.toLowerCase()}`} alt={data.country} />;
  };

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
      list: { entities, noResults },
      filterValues,
      locale,
    } = this.props;

    return (
      <div className="card">
        <div className="card-heading">
          <span className="font-size-20" id="operators-list-header">
            {I18n.t('OPERATORS.HEADING')}
          </span>

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
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
            locale={locale}
            showNoResults={noResults}
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
