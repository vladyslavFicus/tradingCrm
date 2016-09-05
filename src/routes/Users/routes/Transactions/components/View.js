import React, { Component } from 'react';
import classNames from 'classnames';
import { stopEvent, localDateToString } from 'utils/helpers';
import { Pagination } from 'react-bootstrap';
import DateRangePicker from 'components/Forms/DateRangePickerWrapper';
import moment from 'moment';

const config = { tabName: 'transactions' };

class View extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        paymentType: '',
        startDate: '',
        endDate: '',
      },
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handlePaymentTypeChange = this.handlePaymentTypeChange.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.onFiltersChanged = this.onFiltersChanged.bind(this);
  }

  handleSelect(eventKey) {
    const { transactions, loadTransactions, params } = this.props;

    if (!transactions.isLoading) {
      loadTransactions(eventKey - 1, params.id, this.state.filters);
    }
  }

  handlePaymentTypeChange(e) {
    const target = e.target;

    this.setState({ filters: { ...this.state.filters, paymentType: target.value } }, this.onFiltersChanged);
  }

  handleDatesChange({ startDate, endDate }) {
    if (startDate && endDate) {
      this.setState({
        filters: {
          ...this.state.filters,
          startDate: startDate.format('YYYY/MM/DD'),
          endDate: endDate.format('YYYY/MM/DD'),
        },
      }, this.onFiltersChanged);
    }
  }

  onFiltersChanged() {
    this.props.loadTransactions(0, this.props.params.id, this.state.filters);
  }

  componentWillMount() {
    const { transactions, loadTransactions, params } = this.props;

    if (!transactions.isLoading) {
      loadTransactions(0, params.id, this.state.filters);
    }
  }

  render() {
    const { transactions: data } = this.props;
    const { transactions, isLoading } = data;

    return <div id={`tab-${config.tabName}`} className={classNames('tab-pane fade in active')}>
      <table className="table table-striped table-responsive">
        <thead className="thead-default">
        <tr>
          <th width={'20%'}>Transaction ID</th>
          <th width={'20%'} className="text-center">Time</th>
          <th width={'15%'} className="text-center">Payment type</th>
          <th width={'35%'} className="text-center">Payment option</th>
          <th width={'10%'}>Amount</th>
        </tr>
        <tr>
          <td></td>
          <td className="text-center">
            <DateRangePicker
              withPortal
              allowPastDates
              onDatesChange={this.handleDatesChange}
            />
          </td>
          <td className="text-center">
            <select
              name="paymentType"
              id="paymentType"
              className="form-control"
              onChange={this.handlePaymentTypeChange}
            >
              <option value="">All</option>
              <option value="PaymentCompleted">PaymentCompleted</option>
              <option value="PaymentFraudDetected">PaymentFraudDetected</option>
              <option value="WithdrawCompleted">WithdrawCompleted</option>
              <option value="WithdrawFailed">WithdrawFailed</option>
            </select>
          </td>
          <td/>
          <td/>
        </tr>
        </thead>
        <tbody>
        {transactions.content.map((item) => <tr key={item.transactionId}>
          <td>
            <small>{item.transactionId}</small>
          </td>
          <td className="text-center">
            {moment(localDateToString(item.transactionTime)).format('DD.MM.YYYY HH:mm:ss')}
          </td>
          <td className="text-center">{item.transactionName}</td>
          <td className="text-center">{item.paymentOption}</td>
          <td>${item.amount}</td>
        </tr>)}
        </tbody>
      </table>

      {transactions.totalPages > 1 && <div className="row">
        <div className="col-lg-12">
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            items={transactions.totalPages}
            maxButtons={5}
            activePage={transactions.number + 1}
            onSelect={this.handleSelect}/>
        </div>
      </div>}
    </div>;
  }
}

export default View;
