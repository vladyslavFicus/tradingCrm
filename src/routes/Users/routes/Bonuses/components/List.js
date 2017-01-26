import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import { TextFilter, DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import { statuses, statusesLabels } from 'constants/bonus';
import moment from 'moment';
import Amount from 'components/Amount';

class List extends Component {
  state = {
    filters: {
      playerUUID: this.props.params.id,
    },
    page: 0,
  };

  handlePageChanged = (page) => {
    this.setState({ page: page - 1 }, () => this.handleRefresh());
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handleRefresh = () => {
    return this.props.fetchEntities({
      ...this.state.filters,
      page: this.state.page,
    });
  };

  handleAcceptBonus = (id) => {
    this.props.acceptBonus(id)
      .then(() => this.handleRefresh());
  };

  handleCancelBonus = (id) => {
    this.props.cancelBonus(id, this.props.params.id)
      .then(() => this.handleRefresh());
  };

  componentWillMount() {
    this.handleRefresh();
  }

  renderActions = (data) => {
    return <div className="btn-group btn-group-sm">
      {[statuses.COMPLETED, statuses.CANCELLED, statuses.EXPIRED].indexOf(data.state) === -1 && <a
        className="btn btn-sm btn-danger btn-secondary"
        onClick={() => this.handleCancelBonus(data.id)}
        title="Cancel bonus"
      >
        <i className="fa fa-times"/>
      </a>}
    </div>;
  };

  render() {
    const { list: { entities } } = this.props;

    return <div className={'tab-pane fade in active'}>
      <GridView
        dataSource={entities.content}
        onFiltersChanged={this.handleFiltersChanged}
        onPageChange={this.handlePageChanged}
        activePage={entities.number + 1}
        totalPages={entities.totalPages}
        defaultFilters={this.state.filters}
      >
        <GridColumn name="id" header="ID"/>
        <GridColumn
          name="label"
          header="Name"
          headerClassName="text-center"
          filter={(onFilterChange) => <TextFilter
            name="label"
            onFilterChange={onFilterChange}
          />}
          filterClassName="text-center"
          className="text-center"
        />
        <GridColumn
          name="grantedAmount"
          header="Granted amount"
          headerClassName="text-center"
          className="text-center"
          render={(data, column) => <Amount {...data[column.name]}/>}
        />
        <GridColumn
          name="capping"
          header="Capping"
          headerClassName="text-center"
          className="text-center"
          render={(data, column) => <Amount {...data[column.name]}/>}
        />
        <GridColumn
          name="prize"
          header="Prize"
          headerClassName="text-center"
          className="text-center"
          render={(data, column) => <Amount {...data[column.name]}/>}
        />
        <GridColumn
          name="amountToWage"
          header="Amount to wage"
          headerClassName="text-center"
          className="text-center"
          render={(data, column) => <Amount {...data[column.name]}/>}
        />
        <GridColumn
          name="state"
          header="Status"
          headerClassName="text-center"
          filter={(onFilterChange) => <DropDownFilter
            name="state"
            items={{
              '': 'All',
              ...statusesLabels,
            }}
            onFilterChange={onFilterChange}
          />}
          filterClassName="text-center"
          className="text-center"
        />
        <GridColumn
          name="createdDate"
          header="Created at"
          headerClassName="text-center"
          headerStyle={{ width: '20%' }}
          render={(data, column) => moment(data[column.name]).format('DD.MM.YYYY HH:mm:ss')}
          filter={(onFilterChange) => <DateRangeFilter
            isOutsideRange={(date) => moment() <= date}
            onFilterChange={onFilterChange}
          />}
          filterClassName="text-center"
          className="text-center"
        />
        <GridColumn
          name="actions"
          header="Actions"
          headerStyle={{ width: '10%' }}
          render={this.renderActions}
        />
      </GridView>
    </div>;
  }
}

export default List;
