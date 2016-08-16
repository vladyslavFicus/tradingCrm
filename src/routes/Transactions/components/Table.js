import React, { Component } from 'react';
import { Link } from 'react-router';

class Table extends Component {
  renderRow(item) {
    return <tr key={item.transactionId + item.transactionTime}>
      <td className="text-center">
        <small>{item.transactionId}</small>
      </td>
      <td className="text-center">{item.playerUUID}</td>
      <td className="text-center">{item.transactionTime}</td>
      <td className="text-center">{item.transactionName}</td>
      <td className="text-center">${item.amount}</td>
    </tr>;
  }

  renderLoadingRow() {
    return <tr>
      <td colSpan={5}>
        Loading...
      </td>
    </tr>;
  }

  render() {
    const { isLoading, items } = this.props;

    return <table className="table table-stripped table-hovered">
      <thead className="thead-default">
      <tr>
        <th>#</th>
        <th>UUID</th>
        <th>Time</th>
        <th>Description</th>
        <th>Amount</th>
      </tr>
      </thead>
      <tbody>
      {isLoading ? this.renderLoadingRow() : items.map(this.renderRow)}
      </tbody>
    </table>;
  }
}

export default Table;
