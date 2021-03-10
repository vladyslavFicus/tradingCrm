import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { shortify } from 'utils/uuid';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import { callbacksStatuses } from 'constants/callbacks';
import CallbackDetailsModal from 'modals/CallbackDetailsModal';
import { Table, Column } from 'components/Table';
import NoteButton from 'components/NoteButton';
import Uuid from 'components/Uuid';
import './ClientCallbacksGrid.scss';

class ClientCallbacksGrid extends PureComponent {
  static propTypes = {
    clientCallbacksQuery: PropTypes.query({
      callbacks: PropTypes.pageable(PropTypes.callback),
    }).isRequired,
    modals: PropTypes.shape({
      callbackDetailsModal: PropTypes.modalType,
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      clientCallbacksQuery: {
        data,
        loadMore,
      },
    } = this.props;

    const currentPage = data?.callbacks?.page || 0;

    loadMore(currentPage + 1);
  };

  handleOpenDetailsModal = (callbackId) => {
    this.props.modals.callbackDetailsModal.show({ callbackId });
  };

  renderId = ({ callbackId, operatorId }) => (
    <Fragment>
      <div
        className="ClientCallbacksGrid__info-main ClientCallbacksGrid__callback-id"
        onClick={() => this.handleOpenDetailsModal(callbackId)}
      >
        {shortify(callbackId, 'CB')}
      </div>
      <div className="ClientCallbacksGrid__info-secondary">
        {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={operatorId} />
      </div>
    </Fragment>
  );

  renderOperator = ({ operator, operatorId }) => (
    <Fragment>
      <If condition={operator}>
        <div className="ClientCallbacksGrid__info-main">
          {operator.fullName}
        </div>
      </If>
      <div className="ClientCallbacksGrid__info-secondary">
        <Uuid uuid={operatorId} />
      </div>
    </Fragment>
  );

  renderUser = ({ client, userId }) => (
    <div className="ClientCallbacksGrid__client">
      <If condition={client}>
        <div
          className="ClientCallbacksGrid__info-main"
          onClick={this.handleClientClick(userId)}
        >
          {client.fullName}
        </div>
      </If>
      <div className="ClientCallbacksGrid__info-secondary">
        <Uuid uuid={userId} />
      </div>
    </div>
  );

  renderDateTime = (callback, field) => (
    <div>
      <div className="ClientCallbacksGrid__info-main">
        {moment.utc(callback[field]).local().format('DD.MM.YYYY')}
      </div>
      <div className="ClientCallbacksGrid__info-secondary">
        {moment.utc(callback[field]).local().format('HH:mm:ss')}
      </div>
    </div>
  );

  renderStatus = ({ status }) => (
    <div
      className={
        classNames(
          'ClientCallbacksGrid__info-main ClientCallbacksGrid__status',
          `ClientCallbacksGrid__status--${status.toLowerCase()}`,
        )
      }
    >
      {I18n.t(callbacksStatuses[status])}
    </div>
  );

  renderActions = ({ callbackId, userId, note }) => (
    <NoteButton
      key={callbackId}
      targetType={targetTypes.CALLBACK}
      targetUUID={callbackId}
      playerUUID={userId}
      note={note}
    />
  );

  renderReminder = ({ reminder, callbackTime }) => {
    if (reminder) {
      // Reminder format: ISO 8601('PT5M'), get milliseconds via moment.duration
      const reminderMilliseconds = moment.duration(reminder).asMilliseconds();
      const reminderDate = moment.utc(callbackTime).local().subtract(reminderMilliseconds, 'ms');

      return (
        <div>
          <div className="ClientCallbacksGrid__info-main">
            {moment(reminderDate).format('DD.MM.YYYY')}
          </div>
          <div className="ClientCallbacksGrid__info-secondary">
            {moment(reminderDate).format('HH:mm:ss')}
          </div>
        </div>
      );
    }

    return <div>&mdash;</div>;
  }

  render() {
    const {
      clientCallbacksQuery,
      clientCallbacksQuery: { loading },
    } = this.props;

    const { content = [], last = true } = clientCallbacksQuery.data?.callbacks || {};

    return (
      <div className="ClientCallbacksGrid">
        <Table
          stickyFromTop={189}
          items={content}
          loading={loading}
          hasMore={!last}
          onMore={this.handlePageChanged}
        >
          <Column
            header={I18n.t('CALLBACKS.GRID_HEADER.ID')}
            render={this.renderId}
          />
          <Column
            header={I18n.t('CALLBACKS.GRID_HEADER.OPERATOR')}
            render={this.renderOperator}
          />
          <Column
            header={I18n.t('CALLBACKS.GRID_HEADER.TIME')}
            render={callback => this.renderDateTime(callback, 'callbackTime')}
          />
          <Column
            header={I18n.t('CALLBACKS.GRID_HEADER.CREATED')}
            render={callback => this.renderDateTime(callback, 'creationTime')}
          />
          <Column
            header={I18n.t('CALLBACKS.GRID_HEADER.MODIFIED')}
            render={callback => this.renderDateTime(callback, 'updateTime')}
          />
          <Column
            header={I18n.t('CALLBACKS.GRID_HEADER.STATUS')}
            render={this.renderStatus}
          />
          <Column
            header={I18n.t('CALLBACKS.GRID_HEADER.REMINDER')}
            render={this.renderReminder}
          />
          <Column
            header=""
            render={this.renderActions}
          />
        </Table>
      </div>
    );
  }
}

export default withModals({
  callbackDetailsModal: CallbackDetailsModal,
})(ClientCallbacksGrid);
