import React, { Component } from 'react';
import humanizeDuration from 'humanize-duration';
import classNames from 'classnames';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Uuid from '../../../../../components/Uuid';
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
    locale: PropTypes.string.isRequired,
  };

  static defaultProps = {
    dataSource: null,
    insideModal: false,
    onOpenCancelLimitModal: null,
    onNoteClick: null,
  };

  renderActions = (data) => {
    if ([statuses.IN_PROGRESS, statuses.ACTIVE, statuses.PENDING].indexOf(data.status) === -1) {
      return null;
    }

    let buttonLabel = 'Cancel';

    const modalStaticParams = {};
    if (data.status === statuses.IN_PROGRESS || data.status === statuses.ACTIVE) {
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

  renderNotes = data => (
    <NoteButton
      id={`limit-item-note-button-${data.uuid}`}
      note={data.note}
      onClick={this.props.onNoteClick}
      targetEntity={data}
    />
  );

  renderLimit = data => (
    <div>
      {
        data.value.type === amountTypes.MONEY &&
        <div>
          <div className="font-weight-700">
            <Amount {...data.value.limit} />
          </div>
          {
            data.value.used &&
            <div className="font-size-11">
              used <Amount {...data.value.used} />
            </div>
          }
          {
            data.value.left &&
            <div className="font-size-11">
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
          <div className="font-size-11">
            {I18n.t('COMMON.USED', { value: humanizeDuration(data.value.used * 1000, humanizeDurationConfig) })}
          </div>
          <div className="font-size-11">
            {I18n.t('COMMON.LEFT', { value: humanizeDuration(data.value.left * 1000, humanizeDurationConfig) })}
          </div>
        </div>
      }
    </div>
  );

  renderStatus = data => (
    <div>
      <div className={classNames(statusesColor[data.status], 'text-uppercase font-weight-700')}>
        {statusesLabels[data.status] || data.status}
      </div>
      {
        (data.status === statuses.IN_PROGRESS || data.status === statuses.ACTIVE) &&
        <div className="font-size-11">
          {I18n.t('COMMON.SINCE', { date: moment.utc(data.startDate).local().format('DD.MM.YYYY HH:mm') })}
        </div>
      }
      {
        data.status === statuses.PENDING &&
        <div>
          {
            data.statusAuthor &&
            <div className="font-size-11">
              {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={data.statusAuthor} uuidPrefix="OP" />
            </div>
          }
          {
            data.startDate &&
            <div className="font-size-11">
              {I18n.t('COMMON.ACTIVATES_ON', { date: moment.utc(data.startDate).local().format('DD.MM.YYYY HH:mm') })}
            </div>
          }
        </div>
      }
      {
        (data.status === statuses.COOLOFF || data.status === statuses.CANCELED) &&
        <div>
          {
            data.statusAuthor &&
            <div className="font-size-11">
              {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={data.statusAuthor} uuidPrefix="OP" />
            </div>
          }
          {
            data.expirationDate &&
            <div className="font-size-11">
              {data.status === statuses.COOLOFF ? 'until' : 'on'} {' '}
              {moment.utc(data.expirationDate).local().format('DD.MM.YYYY HH:mm')}
            </div>
          }
        </div>
      }
    </div>
  );

  renderType = data => (
    <div>
      <div className="font-weight-700">{typesLabels[data.type]}</div>
      {
        data.author &&
        <div className="font-size-11">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={data.author} />
        </div>
      }
    </div>
  );

  renderCreationDate = data => (
    <div>
      <div className="font-weight-700">
        {moment.utc(data.creationDate).local().format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment.utc(data.creationDate).local().format('HH:mm')}
      </div>
    </div>
  );

  renderPeriod = data => (
    <div className="font-weight-700">
      {
        data.type !== types.SESSION_DURATION ?
          moment().add(data.period, 'seconds').fromNow(true) : ' - '
      }
    </div>
  );

  render() {
    const { dataSource, insideModal, locale } = this.props;

    return (
      <div>
        <GridView
          tableClassName="table data-grid-layout"
          headerClassName="text-uppercase"
          dataSource={dataSource}
          totalPages={1}
          locale={locale}
          showNoResults={dataSource.length === 0}
        >
          <GridColumn
            name="type"
            header="Limit Type"
            render={this.renderType}
          />

          <GridColumn
            name="creationDate"
            header="Set On"
            render={this.renderCreationDate}
          />

          <GridColumn
            name="durationSeconds"
            header="Period"
            render={this.renderPeriod}
          />

          <GridColumn
            name="durationLimit"
            header="Amount/Value"
            render={this.renderLimit}
          />

          <GridColumn
            name="status"
            header="Status"
            render={this.renderStatus}
          />

          {
            !insideModal &&
            <GridColumn
              name="notes"
              header="Note"
              render={this.renderNotes}
            />
          }

          {
            !insideModal &&
            <GridColumn
              name="actions"
              header=""
              render={this.renderActions}
            />
          }
        </GridView>
      </div>
    );
  }
}

export default CommonGridView;
