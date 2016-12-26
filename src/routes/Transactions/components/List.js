import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import { TextFilter, DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import moment from 'moment';
import Amount from 'components/Amount';

class List extends Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
  }

  handlePageChanged(page, filters) {
    if (!this.props.list.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  }

  handleFiltersChanged(filters) {
    this.props.fetchEntities({ ...filters, page: 0 });
  }

  componentWillMount() {
    this.handleFiltersChanged({});
  }

  render() {
    const { list: { entities } } = this.props;

    return <div className="page-content-inner">
      <section className="panel panel-with-borders">
        <div className="panel-heading">
          <h3>Transactions</h3>
        </div>

        <div className="panel-body">
          <GridView
            dataSource={entities.content}
            onFiltersChanged={this.handleFiltersChanged}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
          >
            <GridColumn
              name="transactionId"
              header="Transaction ID"
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="playerUUID"
              header="Player UUID"
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
              filter={(onFilterChange) => <TextFilter
                name="playerUUID"
                onFilterChange={onFilterChange}
              />}
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
              render={(data, column) => <Amount amount={data[column.name]}/>}
              className="text-center"
            />
          </GridView>
        </div>
      </section>
    </div>;
  }
}

export default List;
