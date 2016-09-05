import React, { Component } from 'react';
import { localDateToString } from 'utils/helpers';
import DateRangePicker from 'components/Forms/DateRangePickerWrapper';
import moment from 'moment';

class Table extends Component {
  renderRow(item) {
    return <tr key={item.transactionId + item.transactionTime}>
      <td>
        <small>{item.transactionId}</small>
      </td>
      <td>
        <small>{item.playerUUID}</small>
      </td>
      <td className="text-center">
        {moment(localDateToString(item.transactionTime)).format('DD.MM.YYYY HH:mm:ss')}
      </td>
      <td className="text-center">{item.transactionName}</td>
      <td className="text-center">{item.paymentOption}</td>
      <td>${item.amount}</td>
    </tr>;
  }

  render() {
    const { isLoading, items } = this.props;

    return <table className="table table-stripped table-hovered">
      <thead className="thead-default">
      <tr>
        <th width={'20%'}>Transaction ID</th>
        <th width={'20%'}>Player UUID</th>
        <th width={'20%'} className="text-center">Time</th>
        <th width={'10%'} className="text-center">Payment type</th>
        <th width={'20%'} className="text-center">Payment option</th>
        <th width={'10%'}>Amount</th>
      </tr>
      <tr>
        <td></td>
        <td>
          <input
            type="text"
            className="form-control"
            id="playerUuid"
            onChange={this.props.handlePlayerUuidChange}
          />
        </td>
        <td className="text-center">
          <DateRangePicker
            withPortal
            allowPastDates
            onDatesChange={this.props.handleDatesChange}
          />
        </td>
        <td className="text-center">
          <select
            name="paymentType"
            id="paymentType"
            className="form-control"
            onChange={this.props.handlePaymentTypeChange}
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
      {items.map(this.renderRow)}
      </tbody>
    </table>;
  }
}

export default Table;
