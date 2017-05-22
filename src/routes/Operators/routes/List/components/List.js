import { SubmissionError } from 'redux-form';
import { Link } from 'react-router';
import moment from 'moment';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import Panel, { Content } from '../../../../../components/Panel';
import GridView, { GridColumn } from '../../../../../components/GridView';
import OperatorGridFilter from './OperatorGridFilter';
import { shortify } from '../../../../../utils/uuid';
import {
  statusColorNames as operatorStatusColorNames,
  statusesLabels as operatorStatusesLabels,
} from '../../../../../constants/operators';
import CreateOperatorModal from '../../../components/CreateOperatorModal';

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

  handleFilterSubmit = (filters) => {
    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handleOpenCreateModal = () => {
    this.setState({
      modal: {
        name: 'create-operator',
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
          <div className="font-size-12 color-default">
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
          <Link to={`/operators/${data.uuid}/profile`} target="_blank">
            {[data.firstName, data.lastName].join(' ')}
          </Link>
        </div>
        <div className="font-size-12 color-default">
          {shortify(data.uuid)}
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
          { moment(data.registrationDate).format('DD.MM.YYYY') }
        </div>
        <div className="font-size-12 color-default">
          { moment(data.registrationDate).format('HH.mm') }
        </div>
      </div>
    );
  };

  render() {
    const { filters, modal } = this.state;
    const {
      list: { entities },
      filterValues,
      departments,
      roles,
    } = this.props;

    return (
      <div className="page-content-inner">
        <Panel withBorders>
          <Content>
            <OperatorGridFilter
              onSubmit={this.handleFilterSubmit}
              initialValues={filters}
              filterValues={filterValues}
              onCreateOperatorClick={this.handleOpenCreateModal}
            />
            <GridView
              tableClassName="table table-hovered data-grid-layout"
              headerClassName=""
              dataSource={entities.content}
              onPageChange={this.handlePageChanged}
              activePage={entities.number + 1}
              totalPages={entities.totalPages}
              lazyLoad
            >
              <GridColumn
                name="uuid"
                header="Operator"
                headerClassName="text-uppercase"
                render={this.renderOperator}
              />
              <GridColumn
                name="country"
                header="Country"
                headerClassName="text-uppercase"
                render={this.renderCountry}
              />
              <GridColumn
                name="registered"
                header="Registered"
                headerClassName="text-uppercase"
                render={this.renderRegistered}
              />
              <GridColumn
                name="status"
                header="Status"
                headerClassName="text-uppercase"
                render={this.renderStatus}
              />
            </GridView>
          </Content>
        </Panel>

        {
          modal.name === 'create-operator' &&
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
            isOpen
          />
        }
      </div>
    );
  }
}

export default List;
