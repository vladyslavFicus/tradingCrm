import React, { Component } from 'react';

class Table extends Component {
  renderRow(item) {
    return <tr key={item.id}>
      <td>{item.id}</td>
      <td>{item.campaignPriority}</td>
      <td>{item.campaignName}</td>
      <td>{item.bonusLifetime}</td>
      <td>{item.triggerType}</td>
      <td>{item.startDate} &mdash; {item.endDate}</td>
      <td>
        {'{view} {update} {delete}'}
      </td>
    </tr>;
  }

  render() {
    const { items } = this.props;

    return <table className="table table-stripped table-hovered">
      <thead className="thead-default">
      <tr>
        <th width={'10%'}>ID</th>
        <th width={'10%'}>Priority</th>
        <th width={'15%'}>Name</th>
        <th width={'10%'}>Bonus lifetime</th>
        <th width={'15%'}>Trigger type</th>
        <th width={'20%'}>Period</th>
        <th width={'10%'}>Status</th>
        <th width={'10%'}>Actions</th>
      </tr>
      <tr>
        <td/>
        <td/>
        <td/>
        <td/>
        <td/>
        <td/>
        <td>
          <select className="form-control" onChange={this.props.handleStatusChange}>
            <option value="">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </td>
        <td/>
      </tr>
      </thead>
      <tbody>
      {items.length > 0 ?
        items.map(this.renderRow) : <tr>
        <td colSpan="8" className="text-center">
          <i className="fa fa-warning"/> No campaigns, <a href="#" className="btn btn-primary btn-sm">
          Create first campaign
        </a>
        </td>
      </tr>
      }
      </tbody>
    </table>;
  }
}

export default Table;
