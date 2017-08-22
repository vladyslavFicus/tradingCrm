import { SubmissionError } from 'redux-form';
import { Link } from 'react-router';
import moment from 'moment';
import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel, { Title, Content } from '../../../../../components/Panel';
import GridView, { GridColumn } from '../../../../../components/GridView';
import OperatorGridFilter from './OperatorGridFilter';
import {
  statusColorNames as operatorStatusColorNames,
  statusesLabels as operatorStatusesLabels,
} from '../../../../../constants/operators';
import CreateOperatorModal from '../../../components/CreateOperatorModal';
import Uuid from '../../../../../components/Uuid';

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
    })),
    roles: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
    router: PropTypes.object,
    filterValues: PropTypes.object,
    list: PropTypes.object,
    locale: PropTypes.string.isRequired,
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

  renderStatus = (data) => {
    return (
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
            Since {moment(data.statusChangeDate).format('DD.MM.YYYY')}
          </div>
        }
      </div>
    );
  };

  renderOperator = (data) => {
    return (
      <div>
        <div className="font-weight-700">
          <Link to={`/operators/${data.uuid}/profile`}>
            {[data.firstName, data.lastName].join(' ')}
          </Link>
        </div>
        <div className="font-size-11">
          <Uuid uuid={data.uuid} />
        </div>
      </div>
    );
  };

  renderCountry = (data) => {
    return (
      <div className="font-weight-700">
        {data.country}
      </div>
    );
  };

  renderRegistered = (data) => {
    return (
      <div>
        <div className="font-weight-700">
          {moment(data.registrationDate).format('DD.MM.YYYY')}
        </div>
        <div className="font-size-11">
          {moment(data.registrationDate).format('HH.mm')}
        </div>
      </div>
    );
  };

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
            <div className="row">
              <div className="col-xl-3">
                <span
                  className="font-size-20"
                  id="operators-list-header"
                >
                  Operators
                </span>
              </div>
              <div className="col-xl-3 col-xl-offset-6 text-right">
                <button
                  className="btn btn-default-outline"
                  onClick={this.handleOpenCreateModal}
                  id="create-new-operator-button"
                >
                  + New operator
                </button>
              </div>
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
