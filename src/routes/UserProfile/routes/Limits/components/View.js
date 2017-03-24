import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import humanizeDuration from 'humanize-duration';
import GridView, { GridColumn } from '../../../../../components/GridView';
import {
  typesLabels, types, statuses, statusesColor, statusesLabels, amountTypes,
} from '../../../../../constants/limits';
import Amount from '../../../../../components/Amount';
import { shortify } from '../../../../../utils/uuid';

const humanizeDurationConfig = {
  language: 'en',
  largest: 2,
  conjunction: ' ',
};

class View extends Component {
  static propTypes = {
    fetchLimits: PropTypes.func.isRequired,
    cancelLimit: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchLimits(this.props.params.id);
  }

  handleCancelLimit = (type, id) => {
    this.props.cancelLimit(this.props.params.id, type, id)
      .then(() => this.props.fetchLimits(this.props.params.id));
  };

  renderActions = (data) => {
    const isCancellable = !(
      data.status === statuses.IN_PROGRESS
      && data.expirationDate !== null
      || data.status === statuses.CANCELED
    );

    //const isCancellableNew = data.status === statuses.PENDING || data.statuses === statuses.ACTIVE

    //console.log('data.status', data.status, '-', data.expirationDate);

    return isCancellable ? <button
        className="btn btn-sm"
        onClick={() => this.handleCancelLimit(data.type, data.id)}
      >
        Cancel
      </button> : null;
  }

  renderLimit(data) {
    console.log('data.value.limit - ', data.value.limit, ' used - ', data.value.used, ' left - ', data.value.left);

    //console.log('data.value.used', data.value.used);
    //console.log('data.value.left', data.value.left);

    return (
      <div>
        {
          data.value.type === amountTypes.MONEY &&
          <div>
            <div className="font-weight-700">
              <Amount {...data.value.limit} />
            </div>
            <div className="font-size-10 color-default">
              used <Amount {...data.value.used} />
            </div>
            <div className="font-size-10 color-default">
              left <Amount {...data.value.left} />
            </div>
          </div>
        }
        {
          data.value.type === amountTypes.TIME &&
          <div>
            <div className="font-weight-700">
              {humanizeDuration(data.value.limit * 1000, humanizeDurationConfig)}
            </div>
            <div className="font-size-10 color-default">
              used {humanizeDuration(data.value.used * 1000, humanizeDurationConfig)}
            </div>
            <div className="font-size-10 color-default">
              left {humanizeDuration(data.value.left * 1000, humanizeDurationConfig)}
            </div>
          </div>
        }
      </div>
    );
  }

  renderStatus(data) {
    return (
      <div>
        <div className={classNames(statusesColor[data.status], 'text-uppercase font-weight-700')}>
          {statusesLabels[data.status] || data.status}
        </div>
        {
          data.status === statuses.IN_PROGRESS &&
          <div className="font-size-10 color-default">
            since {moment(data.startDate).format('DD.MM.YYYY')}
          </div>
        }
        {
          data.status === statuses.PENDING &&
          <div>
            {
              data.statusAuthor &&
              <div className="font-size-10 color-default">
                {shortify(data.statusAuthor, 'OP')}
              </div>
            }
            {
              data.startDate &&
              <div className="font-size-10 color-default">
                activates on {moment(data.startDate).format('DD.MM.YYYY')}
              </div>
            }
          </div>
        }
        {
          (data.status === statuses.COOLOFF || data.status === statuses.CANCELED) &&
          <div>
            {
              data.statusAuthor &&
              <div className="font-size-10 color-default">
                {shortify(data.statusAuthor, 'OP')}
              </div>
            }
            {
              data.expirationDate &&
              <div className="font-size-10 color-default">
                until on {moment(data.expirationDate).format('DD.MM.YYYY')}
              </div>
            }
          </div>
        }
      </div>
    );
  }

  renderType = (data) => {
    return (
      <div>
        <div className="font-weight-700">{typesLabels[data.type]}</div>
        <div className="text-muted font-size-10">{shortify(data.author, 'OP')}</div>
      </div>
    );
  };

  renderCreationDate = (data) => {
    return (
      <div>
        <div className="font-weight-700">
          {moment(data.creationDate).format('DD.MM.YYYY')}
        </div>
        <span className="font-size-10 color-default">
          {moment(data.creationDate).format('HH:mm')}
        </span>
      </div>
    );
  };

  renderPeriod = (data) => {
    return (
      <div className="font-weight-700">
        {
          data.type !== types.SESSION_DURATION ?
          moment().add(data.period, 'seconds').fromNow(true) : ' - '
        }
      </div>
    );
  };

  render() {
    const { list } = this.props;

    return (
      <div className="tab-pane fade in active profile-tab-container">
        <GridView
          tableClassName="table table-hovered data-grid-layout"
          headerClassName=""
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
            headerClassName="text-uppercase"
            render={this.renderType}
          />

          <GridColumn
            name="creationDate"
            header="Set On"
            headerClassName="text-uppercase"
            render={this.renderCreationDate}
          />

          <GridColumn
            name="durationSeconds"
            header="Period"
            headerClassName="text-uppercase"
            render={this.renderPeriod}
          />

          <GridColumn
            name="durationLimit"
            header="Amount/Value"
            headerClassName="text-uppercase"
            render={this.renderLimit}
          />

          <GridColumn
            name="status"
            header="Status"
            headerClassName="text-uppercase"
            render={this.renderStatus}
          />

          <GridColumn
            name="actions"
            header=""
            headerClassName="text-uppercase"
            render={this.renderActions}
          />
        </GridView>
      </div>
    );
  }
}

export default View;
