import React, { Component, Fragment } from 'react';
import humanizeDuration from 'humanize-duration';
import classNames from 'classnames';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Uuid from '../../../../../../../components/Uuid';
import GridView, { GridViewColumn } from '../../../../../../../components/GridView';
import {
  typesLabels,
  types,
  statuses,
  statusesColor,
  statusesLabels,
  amountTypes,
} from '../../../../../../../constants/limits';
import Amount from '../../../../../../../components/Amount';
import NoteButton from '../../../../../../../components/NoteButton';
import PropTypes from '../../../../../../../constants/propTypes';

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
    <Fragment>
      <If condition={data.value.type === amountTypes.MONEY}>
        <div className="font-weight-700">
          <Amount {...data.value.limit} />
        </div>
        <If condition={data.value.used}>
          <div className="font-size-11">
            used <Amount {...data.value.used} />
          </div>
        </If>
        <If condition={data.value.left}>
          <div className="font-size-11">
            left <Amount {...data.value.left} />
          </div>
        </If>
      </If>
      <If condition={data.value.type === amountTypes.TIME}>
        <div className="font-weight-700">
          {humanizeDuration(data.value.limit * 1000, humanizeDurationConfig)}
        </div>
        <div className="font-size-11">
          {I18n.t('COMMON.USED', { value: humanizeDuration(data.value.used * 1000, humanizeDurationConfig) })}
        </div>
        <div className="font-size-11">
          {I18n.t('COMMON.LEFT', { value: humanizeDuration(data.value.left * 1000, humanizeDurationConfig) })}
        </div>
      </If>
    </Fragment>
  );

  renderStatus = data => (
    <Fragment>
      <div className={classNames(statusesColor[data.status], 'text-uppercase font-weight-700')}>
        {statusesLabels[data.status] || data.status}
      </div>
      <If condition={data.status === statuses.IN_PROGRESS || data.status === statuses.ACTIVE}>
        <div className="font-size-11">
          {I18n.t('COMMON.SINCE', { date: moment.utc(data.startDate).local().format('DD.MM.YYYY HH:mm') })}
        </div>
      </If>
      <If condition={data.status === statuses.PENDING}>
        <If condition={data.statusAuthor}>
          <div className="font-size-11">
            {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={data.statusAuthor} uuidPrefix="OP" />
          </div>
        </If>
        <If condition={data.startDate}>
          <div className="font-size-11">
            {I18n.t('COMMON.ACTIVATES_ON', { date: moment.utc(data.startDate).local().format('DD.MM.YYYY HH:mm') })}
          </div>
        </If>
      </If>
      <If condition={data.status === statuses.COOLOFF || data.status === statuses.CANCELED}>
        <If condition={data.statusAuthor}>
          <div className="font-size-11">
            {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={data.statusAuthor} uuidPrefix="OP" />
          </div>
        </If>
        <If condition={data.expirationDate}>
          <div className="font-size-11">
            {data.status === statuses.COOLOFF ? 'until' : 'on'} {' '}
            {moment.utc(data.expirationDate).local().format('DD.MM.YYYY HH:mm')}
          </div>
        </If>
      </If>
    </Fragment>
  );

  renderType = data => (
    <Fragment>
      <div className="font-weight-700">{typesLabels[data.type]}</div>
      <If condition={data.author}>
        <div className="font-size-11">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={data.author} />
        </div>
      </If>
    </Fragment>
  );

  renderCreationDate = data => (
    <Fragment>
      <div className="font-weight-700">
        {moment.utc(data.creationDate).local().format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment.utc(data.creationDate).local().format('HH:mm')}
      </div>
    </Fragment>
  );

  renderPeriod = data => (
    <div className="font-weight-700">
      <Choose>
        <When condition={data.type === types.SESSION_DURATION}>
          {' - '}
        </When>
        <Otherwise>
          {moment().add(data.period, 'seconds').fromNow(true)}
        </Otherwise>
      </Choose>
    </div>
  );

  render() {
    const { dataSource, insideModal, locale } = this.props;

    return (
      <div>
        <GridView
          dataSource={dataSource}
          totalPages={1}
          locale={locale}
          showNoResults={dataSource.length === 0}
        >
          <GridViewColumn
            name="type"
            header="Limit Type"
            render={this.renderType}
            headerStyle={{ width: '15%' }}
          />
          <GridViewColumn
            name="creationDate"
            header="Set On"
            render={this.renderCreationDate}
            headerStyle={{ width: '15%' }}
          />
          <GridViewColumn
            name="durationSeconds"
            header="Period"
            render={this.renderPeriod}
            headerStyle={{ width: '15%' }}
          />
          <GridViewColumn
            name="durationLimit"
            header="Amount/Value"
            render={this.renderLimit}
            headerStyle={{ width: '15%' }}
          />
          <GridViewColumn
            name="status"
            header="Status"
            render={this.renderStatus}
            headerStyle={{ width: '15%' }}
          />
          <If condition={!insideModal}>
            <GridViewColumn
              name="notes"
              header="Note"
              render={this.renderNotes}
            />
          </If>
          <If condition={!insideModal}>
            <GridViewColumn
              name="actions"
              header=""
              render={this.renderActions}
            />
          </If>
        </GridView>
      </div>
    );
  }
}

export default CommonGridView;
