import React, { Component } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import { DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import classNames from 'classnames';
import moment from 'moment';
import Amount from 'components/Amount';

const config = { tabName: 'transactions' };

class View extends Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
  }

  handlePageChanged(page, filters) {
    if (!this.props.isLoading) {
      this.props.fetchTransactions({ ...filters, page: page - 1 });
    }
  }

  handleFiltersChanged(filters) {
    this.props.fetchTransactions({ ...filters, page: 0 });
  }

  componentWillMount() {
    this.handleFiltersChanged({ playerUUID: this.props.params.id });
  }

  render() {
    const { entities, params } = this.props;

    return <div id={`tab-${config.tabName}`} className={classNames('tab-pane fade in active')}>
      <GridView
        dataSource={entities.content}
        onFiltersChanged={this.handleFiltersChanged}
        onPageChange={this.handlePageChanged}
        activePage={entities.number + 1}
        totalPages={entities.totalPages}
        defaultFilters={{ playerUUID: params.id }}
      >
        <GridColumn
          name="transactionId"
          header="Transaction ID"
          headerStyle={{ width: '20%' }}
          render={(data, column) => <small>{data[column.name]}</small>}
        />
        <GridColumn
          name="transactionTime"
          header="Time"
          headerClassName="text-center"
          headerStyle={{ width: '20%' }}
          render={(data, column) => moment(data[column.name]).format('DD.MM.YYYY HH:mm:ss')}
          filter={(onFilterChange) => <DateRangeFilter
            isOutsideRange={(date) => date.isAfter(moment())}
            onFilterChange={onFilterChange}
          />}
          filterClassName="text-center"
          className="text-center"
        />
        <GridColumn
          name="transactionName"
          header="Payment type"
          headerClassName="text-center"
          headerStyle={{ width: '10%' }}
          className="text-center"
          filter={(onFilterChange) => <DropDownFilter
            name="type"
            items={{
              '': 'All',
              PaymentCompleted: 'PaymentCompleted',
              PaymentFraudDetected: 'PaymentFraudDetected',
              WithdrawCompleted: 'WithdrawCompleted',
              WithdrawFailed: 'WithdrawFailed',
            }}
            onFilterChange={onFilterChange}
          />}
        />
        <GridColumn
          name="paymentOption"
          header="Payment option"
          headerClassName="text-center"
          className="text-center"
        />
        <GridColumn
          name="amount"
          header="Amount"
          headerClassName="text-center"
          headerStyle={{ width: '10%' }}
          render={(data, column) => <Amount amount={data[column.name]} />}
          className="text-center"
        />
      </GridView>
    </div>;
  }
}

export default View;
