import React, { Component } from 'react';
import { Link } from 'react-router';

class Table extends Component {
  renderRow(item) {
    return <tr key={item.id}>
      <td className="text-center">{item.id}</td>
      <td className="text-center">{item.username}</td>
      <td className="text-center">{item.email}</td>
      <td className="text-center">{item.currency}</td>
      <td className="text-center">{item.uuid}</td>
      <td className="text-center">
        <Link to={`/users/view/${item.uuid}`} title={'View user profile'}>
          <i className="fa fa-search"/>
        </Link>&nbsp;

        <Link to={`/users/edit/${item.uuid}`} title={'Edit user'}>
          <i className="fa fa-edit"/>
        </Link>&nbsp;

        <Link to={`/users/delete/${item.uuid}`} title={'Delete user'}>
          <i className="fa fa-trash"/>
        </Link>
      </td>
    </tr>;
  }

  renderLoadingRow() {
    return <tr>
      <td colSpan={6}>
        Loading...
      </td>
    </tr>;
  }

  render() {
    const { isLoading, items } = this.props;

    return <table className="table table-stripped table-hovered">
      <thead className="thead-default">
      <tr>
        <th className="text-center">#</th>
        <th className="text-center">Username</th>
        <th className="text-center">Email</th>
        <th className="text-center">Currency</th>
        <th className="text-center">UUID</th>
        <th className="text-center">Actions</th>
      </tr>
      </thead>
      <tbody>
      {isLoading ? this.renderLoadingRow() : items.map(this.renderRow)}
      </tbody>
    </table>
  }
}

export default Table;
