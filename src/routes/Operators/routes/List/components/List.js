import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { Link } from 'react-router';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import Panel, { Title, Content } from '../../../../../components/Panel';
import GridView, { GridColumn } from '../../../../../components/GridView';
import OperatorGridFilter from './OperatorGridFilter';
import {
  statusColorNames as operatorStatusColorNames,
  statusesLabels as operatorStatusesLabels,
} from '../../../../../constants/operators';
import CreateOperatorModal from '../../../components/CreateOperatorModal';
import Uuid from '../../../../../components/Uuid';
import MiniProfile from '../../../../../components/MiniProfile';
import { types as miniProfileTypes } from '../../../../../constants/miniProfile';

const MODAL_CREATE_OPERATOR = 'modal-create-operator';
const modalInitialState = {
  name: null,
  params: {},
};

class List extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    onSubmitNewOperator: PropTypes.func.isRequired,
    fetchEntities: PropTypes.func.isRequired,
    departments: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })).isRequired,
    roles: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })).isRequired,
    router: PropTypes.object,
    filterValues: PropTypes.object,
    list: PropTypes.object,
    locale: PropTypes.string.isRequired,
    fetchOperatorMiniProfile: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isLoading: false,
    router: null,
    filterValues: null,
    list: null,
  };

  state = {
    modal: { ...modalInitialState },
    filters: {},
    page: 0,
  };

  componentWillMount() {
    this.handleRefresh();
  }

  handlePageChanged = (page) => {
    if (!this.props.isLoading) {
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

  handleOpenCreateModal = () => {
    this.setState({
      modal: {
        name: MODAL_CREATE_OPERATOR,
        params: {},
      },
    });
  };

  handleModalClose = (cb) => {
    this.setState({ modal: { ...modalInitialState } }, () => {
      if (typeof cb === 'function') {
        cb();
      }
    });
  };

  handleSubmitNewOperator = async (data) => {
    const action = await this.props.onSubmitNewOperator(data);

    if (action.error) {
      throw new SubmissionError({ __error: action.payload });
    }

    this.handleModalClose(() => {
      this.props.router.push(`/operators/${action.payload.uuid}/profile`);
    });
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
          dataSource={this.props.fetchOperatorMiniProfile}
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
        {moment.utc(data.registrationDate).local().format('HH.mm')}
      </div>
    </div>
  );

  render() {
    const { filters, modal } = this.state;
    const {
      list: { entities, noResults },
      filterValues,
      departments,
      roles,
      locale,
    } = this.props;

    return (
      <div className="page-content-inner">
        <Panel withBorders>
          <Title>
            <div className="clearfix">
              <span className="font-size-20" id="operators-list-header">Operators</span>
              <button
                className="btn btn-default-outline pull-right"
                onClick={this.handleOpenCreateModal}
                id="create-new-operator-button"
              >
                {I18n.t('OPERATORS.CREATE_OPERATOR_BUTTON')}
              </button>
            </div>
          </Title>

          <OperatorGridFilter
            onSubmit={this.handleFiltersChanged}
            initialValues={filters}
            filterValues={filterValues}
          />

          <Content>
            <GridView
              tableClassName="table table-hovered data-grid-layout"
              headerClassName="text-uppercase"
              dataSource={entities.content}
              onPageChange={this.handlePageChanged}
              activePage={entities.number + 1}
              totalPages={entities.totalPages}
              lazyLoad
              locale={locale}
              showNoResults={noResults}
            >
              <GridColumn
                name="uuid"
                header="Operator"
                render={this.renderOperator}
              />
              <GridColumn
                name="country"
                header="Country"
                render={this.renderCountry}
              />
              <GridColumn
                name="registered"
                header="Registered"
                render={this.renderRegistered}
              />
              <GridColumn
                name="status"
                header="Status"
                render={this.renderStatus}
              />
            </GridView>
          </Content>
        </Panel>

        {
          modal.name === MODAL_CREATE_OPERATOR &&
          <CreateOperatorModal
            onSubmit={this.handleSubmitNewOperator}
            departments={departments}
            roles={roles}
            initialValues={{
              department: departments[0] ? departments[0].value : null,
              role: roles[0] ? roles[0].value : null,
              sendMail: true,
            }}
            onClose={this.handleModalClose}
          />
        }
      </div>
    );
  }
}

export default List;
