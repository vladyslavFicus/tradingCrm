import React, { Component, PropTypes } from 'react';
import Panel, { Content } from 'components/Panel';
import GridView, { GridColumn } from 'components/GridView';
import OperatorGridFilter from './OperatorGridFilter';
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

  handleModalClose = () => {
    this.setState({ modal: { ...modalInitialState } });
  };

  handleSubmitNewOperator = async (data) => {
    console.log(data);
    const action = await this.props.onSubmitNewOperator(data);
    console.log(action);

    if (action.error) {
      throw new SubmissionError({ __error: action.payload });
    }

    this.handleModalClose();
    //this.props.router.push(`/operators/${action.payload.uuid}/profile`);
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
              name="id"
              header="Operator"
              headerClassName='text-uppercase'
            />
            <GridColumn
              name="location"
              header="Country"
              headerClassName='text-uppercase'
            />
            <GridColumn
              name="affiliateId"
              header="Registered"
              headerClassName='text-uppercase'
            />
            <GridColumn
              name="registrationDate"
              header="Status"
              headerClassName='text-uppercase'
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
}

export default List;
