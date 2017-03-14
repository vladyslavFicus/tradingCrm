import React, { Component, PropTypes } from 'react';
import Panel, { Content } from 'components/Panel';
import GridView, { GridColumn } from 'components/GridView';
import OperatorGridFilter from './OperatorGridFilter';

class List extends Component {
  state = {
    filters: {},
    page: 0,
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

  render() {
    const { filters } = this.state;
    const { list: { entities }, filterValues } = this.props;

    return <div className="page-content-inner">
      <Panel withBorders>
        <Content>
          <OperatorGridFilter
            onSubmit={this.handleFilterSubmit}
            initialValues={filters}
            filterValues={filterValues}
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
    </div>;
  }
}

export default List;
