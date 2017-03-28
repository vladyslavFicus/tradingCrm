import React, { Component } from 'react';
import humanizeDuration from 'humanize-duration';
import classNames from 'classnames';
import moment from 'moment';
import { shortify } from '../../../../../utils/uuid';
import GridView, { GridColumn } from '../../../../../components/GridView';
import {
  typesLabels, types, statuses, statusesColor, statusesLabels, amountTypes,
} from '../../../../../constants/limits';
import Amount from '../../../../../components/Amount';
import NoteButton from '../../../../../components/NoteButton';
import PropTypes from '../../../../../constants/propTypes';

const humanizeDurationConfig = {
  language: 'en',
  largest: 2,
  conjunction: ' ',
};

class CommonGridView extends Component {
  static propTypes = {
    dataSource: PropTypes.arrayOf(PropTypes.limitEntity),
    onOpenCancelLimitModal: PropTypes.func,
    onNoteClick: PropTypes.func,
    insideModal: PropTypes.bool,
  };

  static defaultProps = {
    insideModal: false,
  };

  renderActions = (data) => {
    if (!(data.status === statuses.IN_PROGRESS || data.status === statuses.PENDING)) {
      return null;
    }

    let buttonLabel = 'Cancel';

    const modalStaticParams = {};
    if (data.status === statuses.IN_PROGRESS) {
      modalStaticParams.modalTitle = 'Cancel limit';
      modalStaticParams.modalSubTitle = 'You are about to cancel the wager limit';
      modalStaticParams.cancelButtonLabel = 'Leave active';
      modalStaticParams.submitButtonLabel = 'Cancel limit';
      modalStaticParams.noteText = 'The limit can only be canceled after the cool off period';
    } else if (data.status === statuses.PENDING) {
      buttonLabel = 'Dismiss';
      modalStaticParams.modalTitle = 'Dismiss pending limit';
      modalStaticParams.modalSubTitle = 'You are about to dismiss the pending loss limit';
      modalStaticParams.cancelButtonLabel = 'Leave pending';
      modalStaticParams.submitButtonLabel = 'Dismiss limit';
      modalStaticParams.noteText = 'The limit will be immediately dismissed';
    }

    return (
      <button
        className="btn btn-sm"
        onClick={e => this.props.onOpenCancelLimitModal(e, 'cancel-limit', {
          data,
          ...modalStaticParams,
        })}
      >
        {buttonLabel}
      </button>
    );
  };

  renderNotes = (data) => {
    return (
      <div>
        <NoteButton
          id={`limit-item-note-button-${data.uuid}`}
          className="cursor-pointer margin-right-5"
          onClick={id => this.props.onNoteClick(id, data)}
        >
          {data.note
            ? <i className="fa fa-sticky-note" />
            : <i className="fa fa-sticky-note-o" />
          }
        </NoteButton>
      </div>
    );
  };

  renderLimit(data) {
    return (
      <div>
        {
          data.value.type === amountTypes.MONEY &&
          <div>
            <div className="font-weight-700">
              <Amount {...data.value.limit} />
            </div>
            {
              data.value.used &&
              <div className="font-size-10 color-default">
                used <Amount {...data.value.used} />
              </div>
            }
            {
              data.value.left &&
              <div className="font-size-10 color-default">
                left <Amount {...data.value.left} />
              </div>
            }
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
                {data.status === statuses.COOLOFF ? 'until' : 'on'}
                {moment(data.expirationDate).format('DD.MM.YYYY')}
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
    const { dataSource, insideModal } = this.props;

    return (
      <div className="tab-pane fade in active profile-tab-container">
        <GridView
          tableClassName="table table-hovered data-grid-layout"
          headerClassName=""
          dataSource={dataSource}
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

          {
            !insideModal &&
            <GridColumn
              name="notes"
              header="Note"
              headerClassName="text-uppercase"
              render={this.renderNotes}
            />
          }

          {
            !insideModal &&
            <GridColumn
              name="actions"
              header=""
              headerClassName="text-uppercase"
              render={this.renderActions}
            />
          }
        </GridView>
      </div>
    );
  }
}

export default CommonGridView;
