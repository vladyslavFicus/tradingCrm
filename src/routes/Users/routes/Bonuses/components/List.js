import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import { Link } from 'react-router';
import { TextFilter, DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import moment from 'moment';

class List extends Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
  }

  handlePageChanged(page, filters = {}) {
    if (!this.props.list.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  }

  handleFiltersChanged(filters = {}) {
    this.props.fetchEntities({ ...filters, page: 0 });
  }

  renderActions(data, column, filters) {
    return <div className="btn-group btn-group-sm">
      {data.state === 'INACTIVE' && <a
        className="btn btn-sm btn-success btn-secondary"
        onClick={() => this.props.changeCampaignState(filters, 'activate', data.id)}
        title="Accept bonus"
      >
        <i className="fa fa-check"/>
      </a>}
      {data.state !== 'COMPLETED' && <a
        className="btn btn-sm btn-danger btn-secondary"
        onClick={() => this.props.changeCampaignState(filters, 'complete', data.id)}
        title="Complete campaign"
      >
        <i className="fa fa-times"/>
      </a>}
    </div>;
  }

  componentWillMount() {
    this.handleFiltersChanged({ playerUUID: this.props.params.id });
  }

  render() {
    const { list: { entities }, params } = this.props;

    return <div className={'tab-pane fade in active'}>
      <GridView
        dataSource={entities.content}
        onFiltersChanged={this.handleFiltersChanged}
        onPageChange={this.handlePageChanged}
        activePage={entities.number + 1}
        totalPages={entities.totalPages}
        defaultFilters={{
          playerUUID: params.id,
        }}
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
        />
        <GridColumn
          name="capping"
          header="Capping"
          headerClassName="text-center"
          className="text-center"
        />
        <GridColumn
          name="prize"
          header="Prize"
          headerClassName="text-center"
          className="text-center"
        />
        <GridColumn
          name="amountToWage"
          header="Amount to wage"
          headerClassName="text-center"
          className="text-center"
        />
        <GridColumn
          name="state"
          header="Status"
          headerClassName="text-center"
          filter={(onFilterChange) => <DropDownFilter
            name="state"
            items={{
              '': 'All',
              INACTIVE: 'INACTIVE',
              IN_PROGRESS: 'IN_PROGRESS',
              WAGERING_COMPLETE: 'WAGERING_COMPLETE',
              CONSUMED: 'CONSUMED',
              CANCELLED: 'CANCELLED',
              EXPIRED: 'EXPIRED',
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
          filter={(onFilterChange) => <DateRangeFilter onFilterChange={onFilterChange}/>}
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
