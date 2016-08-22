import React, { Component, PropTypes } from 'react';
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
        <Link to={`/users/${item.uuid}/profile`} title={'View user profile'}>
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

  render() {
    const { items } = this.props;

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
      <tr>
        <td></td>
        <td>
          <input
            type="text"
            id="filter-username"
            className="form-control"
            onChange={(e) => this.props.handleFilterChange('username', e.target.value)}
          />
        </td>
        <td>
          <input
            type="text"
            id="filter-email"
            className="form-control"
            onChange={(e) => this.props.handleFilterChange('email', e.target.value)}
          />
        </td>
        <td>
          <select
            id="filter-currency"
            className="form-control"
            onChange={(e) => this.props.handleFilterChange('currency', e.target.value)}
          >
            <option value="">All</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="UAH">UAH</option>
          </select>
        </td>
        <td>
          <input
            type="text"
            id="filter-uuid"
            className="form-control"
            onChange={(e) => this.props.handleFilterChange('uuid', e.target.value)}
          />
        </td>
        <td></td>
      </tr>
      </thead>
      <tbody>
      {items.map(this.renderRow)}
      </tbody>
    </table>;
  }
}

Table.propTypes = {
  items: PropTypes.array.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
};

export default Table;
