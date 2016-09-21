import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionCreators as transactionsListActionCreators } from '../modules/transactions-list';
import GridView, { GridColumn } from 'components/GridView';
import DateRangePicker from 'components/Forms/DateRangePickerWrapper';
import moment from 'moment';

const DateRangeFilter = ({ onFilterChange }) => (
  <DateRangePicker
    withPortal
    allowPastDates
    onDatesChange={({ startDate, endDate }) => {
      if (startDate && endDate) {
        onFilterChange({
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
        });
      }
    }}
  />
);

const PlayerUuidFilter = ({ onFilterChange }) => (
  <input
    type="text"
    className="form-control"
    onChange={(e) => onFilterChange({ playerUUID: e.target.value })}
  />
);

const PaymentTypeFilter = ({ onFilterChange }) => (
  <select
    className="form-control"
    onChange={(e) => onFilterChange({ paymentType: e.target.value })}
  >
    <option value="">All</option>
    <option value="PaymentCompleted">PaymentCompleted</option>
    <option value="PaymentFraudDetected">PaymentFraudDetected</option>
    <option value="WithdrawCompleted">WithdrawCompleted</option>
    <option value="WithdrawFailed">WithdrawFailed</option>
  </select>
);

class List extends Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
  }

  handlePageChanged(page) {
    const { transactions, loadTransactions } = this.props;

    if (!transactions.isLoading) {
      loadTransactions(page - 1, this.state.filters);
    }
  }

  handleFiltersChanged(filters) {
    this.props.loadTransactions(0, filters);
  }

  componentWillMount() {
    const { transactions, loadTransactions } = this.props;

    if (!transactions.isLoading) {
      loadTransactions();
    }
  }

  render() {
    const { transactions: data } = this.props;
    const { transactions, isLoading } = data;

    return <div className="page-content-inner">
      <section className="panel panel-with-borders">
        <div className="panel-heading">
          <h3>Transactions</h3>
        </div>

        <div className="panel-body">
          <GridView
            dataSource={transactions.content}
            onFiltersChanged={this.handleFiltersChanged}
            onPageChange={this.handlePageChanged}
          >
            <GridColumn
              name="transactionId"
              header="Transaction ID"
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="playerUUID"
              header="Player UUID"
              render={(data, column) => <small>{data[column.name]}</small>}
              filter={(onFilterChange) => <PlayerUuidFilter onFilterChange={onFilterChange}/>}
            />
            <GridColumn
              name="time"
              header="Time"
              headerClassName="text-center"
              render={(data, column) => moment(data[column.name]).format('DD.MM.YYYY HH:mm:ss')}
              filter={(onFilterChange) => <DateRangeFilter onFilterChange={onFilterChange}/>}
              filterClassName="text-center"
            />
            <GridColumn
              name="paymentOption"
              header="Payment option"
              headerClassName="text-center"
              filter={(onFilterChange) => <PaymentTypeFilter onFilterChange={onFilterChange}/>}
            />
            <GridColumn
              name="amount"
              header="Amount"
              render={(data, column) => `$${data[column.name]}`}
            />
          </GridView>
        </div>
      </section>
    </div>;
  }
}

const mapStateToProps = (state) => ({ transactions: { ...state.transactionsList } });
const mapActions = {
  ...transactionsListActionCreators,
};

export default connect(mapStateToProps, mapActions)(List);
