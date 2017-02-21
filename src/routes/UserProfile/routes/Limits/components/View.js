import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import classNames from 'classnames';
import { LIMIT_TYPES_LABELS, LIMIT_TYPES, LIMIT_STATUSES } from '../constants';
import Amount from 'components/Amount';
import moment from 'moment';

const config = { tabName: 'limits' };

class View extends Component {
  constructor(props) {
    super(props);

    this.renderActions = this.renderActions.bind(this);
    this.handleCancelLimit = this.handleCancelLimit.bind(this);
  }

  componentDidMount() {
    this.props.fetchLimits(this.props.params.id);
  }

  handleCancelLimit(type, id) {
    this.props.cancelLimit(this.props.params.id, type, id)
      .then(() => this.props.fetchLimits(this.props.params.id));
  }

  renderActions(data) {
    const isCancellable = !(
      data.status === LIMIT_STATUSES.IN_PROGRESS
      && data.expirationDate !== null
      || data.status === LIMIT_STATUSES.CANCELLED
    );

    return isCancellable ? <button
        className="btn btn-danger btn-sm"
        onClick={() => this.handleCancelLimit(data.type, data.id)}
      >
        Cancel
      </button> : null;
  }

  renderLimit(data) {
    return data.type === LIMIT_TYPES.SESSION_DURATION ?
      <span>
        {data.durationLimit} {data.durationLimitTimeUnit.toLowerCase()}
      </span> :
      <span>
        <Amount amount={data.moneyLimit}/> per {data.duration} {data.durationUnit.toLowerCase()}
      </span>;
  }

  renderStatus(data) {
    return <div>
      {data.status}
      {data.status === LIMIT_STATUSES.CANCELLED && !!data.expirationDate ?
        <p className="text-muted">
          {`Active until ${moment(data.expirationDate).format('YYYY.MM.DD HH:mm:ss')}`}
        </p> : null
      }
    </div>;
  }

  render() {
    const { list } = this.props;

    return (
      <div id={`tab-${config.tabName}`} className={classNames('tab-pane fade in active')}>
        <GridView
          dataSource={list || []}
          onFiltersChanged={() => {
          }}
          onPageChange={() => {
          }}
          activePage={0}
          totalPages={1}
        >

          <GridColumn
            name="type"
            header="Limit Type"
            headerClassName="text-center"
            className="text-center"
            render={(data, column) => <span> {LIMIT_TYPES_LABELS[data[column.name]]} </span>}
          />

          <GridColumn
            name="creationDate"
            header="Set On"
            headerClassName="text-center"
            className="text-center"
            render={(data, column) => moment(data[column.name]).format('DD.MM.YYYY HH:mm:ss')}
          />

          <GridColumn
            name="startDate"
            header="Start Date"
            headerClassName="text-center"
            className="text-center"
            render={(data, column) => moment(data[column.name]).format('DD.MM.YYYY HH:mm:ss')}
          />

          <GridColumn
            name="status"
            header="Status"
            headerClassName="text-center"
            className="text-center"
            render={this.renderStatus}
          />

          <GridColumn
            name="durationLimit"
            header="Amount/Value"
            headerClassName="text-center"
            className="text-center"
            render={this.renderLimit}
          />

          <GridColumn
            name="actions"
            header="Actions"
            headerClassName="text-center"
            className="text-center"
            render={this.renderActions}
          />

        </GridView>

      </div>
    );
  }
}

export default View;
