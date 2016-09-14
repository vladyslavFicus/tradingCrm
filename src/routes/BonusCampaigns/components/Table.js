import React, { Component } from 'react';
import { localDateToString } from 'utils/helpers';

class Table extends Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderActions = this.renderActions.bind(this);

    this.handleActivate = this.handleActivate.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  handleActivate(id) {
    this.props.onChangeCampaignState('activate', id);
  }

  handleComplete(id) {
    this.props.onChangeCampaignState('complete', id);
  }

  renderActions(item) {
    return <div className="btn-group btn-group-sm">
      {item.state === 'INACTIVE' &&
      <a className="btn btn-sm btn-primary btn-secondary" onClick={() => this.handleActivate(item.id)}>
        <i className="fa fa-check"/> Activate
      </a>}
      <a className="btn btn-sm btn-success btn-secondary" onClick={() => this.handleComplete(item.id)}>
        <i className="fa fa-check"/> Complete
      </a>
    </div>;
  }

  renderRow(item) {
    return <tr key={item.id}>
      <td>{item.id}</td>
      <td>{item.campaignPriority}</td>
      <td>{item.campaignName}</td>
      <td>{item.bonusLifetime}</td>
      <td>{item.triggerType}</td>
      <td>{localDateToString(item.startDate)} &mdash; {localDateToString(item.endDate)}</td>
      <td>{item.state}</td>
      <td>
        {this.renderActions(item)}
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
            <option value="INACTIVE">Inactive</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </td>
        <td/>
      </tr>
      </thead>
      <tbody>
      {items.length > 0 ?
        items.map(this.renderRow) : <tr>
        <td colSpan="8" className="text-center">
          <i className="fa fa-warning"/> No campaigns
        </td>
      </tr>}
      </tbody>
    </table>;
  }
}

export default Table;
