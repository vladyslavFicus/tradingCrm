import React, { Component, PropTypes } from 'react';
import Panel, { Content } from 'components/Panel';
import GridView, { GridColumn } from 'components/GridView';
import OperatorGridFilter from './OperatorGridFilter';
import { Link } from 'react-router';
import { shortify } from 'utils/uuid';
import moment from 'moment';
import classNames from 'classnames';
import {
  statusColorNames as operatorStatusColorNames,
  statusesLabels as operatorStatusesLabels
} from 'constants/operators';
import CreateOperatorModal from '../../../components/CreateOperatorModal';
import { SubmissionError } from 'redux-form';

const modalInitialState = {
  name: null,
  params: {},
};

class List extends Component {
  state = {
    modal: { ...modalInitialState },
    filters: {},
    page: 0,
  };

  static propTypes = {
    onSubmitNewOperator: PropTypes.func.isRequired,
    departments: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
    roles: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
  };

  handlePageChanged = (page) => {
    if (!this.props.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleRefresh = () => {
    console.log('implement handleRefresh');
  };

  componentWillMount() {
    this.handleRefresh();
  }

  handleFilterSubmit = (filters) => {
    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handleOpenCreateModal = () => {
    this.setState({
      modal: {
        name: 'create-operator',
        params: {},
      }
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

  render() {
    const { filters, modal } = this.state;
    const {
      list: { entities },
      filterValues,
      departments,
      roles,
    } = this.props;

    return <div className="page-content-inner">
      <Panel withBorders>
        <Content>
          <OperatorGridFilter
            onSubmit={this.handleFilterSubmit}
            initialValues={filters}
            filterValues={filterValues}
            onCreateOperatorClick={this.handleOpenCreateModal}
          />
          <GridView
            tableClassName="table table-hovered"
            headerClassName=""
            dataSource={entities.content}
            onFiltersChanged={this.handleFiltersChanged}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
          >
            <GridColumn
              name="operatorId"
              header="Operator"
              headerClassName='text-uppercase'
              render={this.renderOperator}
            />
            <GridColumn
              name="country"
              header="Country"
              headerClassName='text-uppercase'
              render={this.renderCountry}
            />
            <GridColumn
              name="registered"
              header="Registered"
              headerClassName='text-uppercase'
              render={this.renderRegistered}
            />
            <GridColumn
              name="status"
              header="Status"
              headerClassName='text-uppercase'
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
          onClose={this.handleModalClose}
          isOpen={true}
        />
      }
    </div>;
  }

  renderOperator = data => {
    return (
      <div>
        <div className="font-weight-700">
          <Link to={`/operators/${data.operatorId}/profile`} target="_blank">
            {[data.firstName, data.lastName].join(' ')}
          </Link>
        </div>
        <div className="font-size-12 color-default">
          {shortify(data.operatorId, 'OP')}
        </div>
      </div>
    );
  };

  renderCountry = data => {
    return (
      <div className="font-weight-700">
        {data.country}
      </div>
    );
  };

  renderRegistered = data => {
    return (
      <div>
        <div className="font-weight-700">
          { moment(data.registered).format('DD.MM.YYYY') }
        </div>
        <div className="font-size-12 color-default">
          { moment(data.registered).format('HH.mm') }
        </div>
      </div>
    );
  };

  renderStatus = data => {
    return (
      <div>
        <div className={
          classNames(operatorStatusColorNames[data.status], 'text-uppercase font-weight-700')
        }>
          {operatorStatusesLabels[data.status] || data.status}
        </div>
        <div className="font-size-12 color-default">
          Since {moment(data.statusChanged).format('DD.MM.YYYY')}
        </div>
      </div>
    );
  };
}

export default List;
