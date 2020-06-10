import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import { callbacksStatuses } from 'constants/callbacks';
import CallbackDetailsModal from 'modals/CallbackDetailsModal';
import Grid, { GridColumn } from 'components/Grid';
import NoteButton from 'components/NoteButton';
import Uuid from 'components/Uuid';
import { shortify } from 'utils/uuid';
import './CallbacksGrid.scss';

class CallbacksGrid extends PureComponent {
  static propTypes = {
    callbacksData: PropTypes.query({
      callbacks: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.callback),
      }),
    }).isRequired,
    modals: PropTypes.shape({
      callbackDetailsModal: PropTypes.modalType,
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      callbacksData,
      callbacksData: {
        loadMore,
        loading,
      },
    } = this.props;

    const currentPage = get(callbacksData, 'data.callbacks.data.page') || 0;

    if (!loading) {
      loadMore(currentPage + 1);
    }
  };

  handleOpenDetailsModal = ({ callbackId }) => {
    this.props.modals.callbackDetailsModal.show({ callbackId });
  };

  handleClientClick = userId => (event) => {
    event.preventDefault();
    event.stopPropagation();

    window.open(`/clients/${userId}/profile`, '_blank');
  };

  renderId = ({ callbackId, operatorId }) => (
    <Fragment>
      <div className="CallbacksGrid__info-main">
        {shortify(callbackId, 'CB')}
      </div>
      <div className="CallbacksGrid__info-secondary">
        {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={operatorId} />
      </div>
    </Fragment>
  );

  renderOperator = ({ operator, operatorId }) => (
    <Fragment>
      <If condition={operator}>
        <div className="CallbacksGrid__info-main">
          {operator.fullName}
        </div>
      </If>
      <div className="CallbacksGrid__info-secondary">
        <Uuid uuid={operatorId} />
      </div>
    </Fragment>
  );

  renderUser = ({ client, userId }) => (
    <div className="CallbacksGrid__client">
      <If condition={client}>
        <div
          className="CallbacksGrid__info-main"
          onClick={this.handleClientClick(userId)}
        >
          {client.fullName}
        </div>
      </If>
      <div className="CallbacksGrid__info-secondary">
        <Uuid uuid={userId} />
      </div>
    </div>
  );

  renderDateTime = (callback, field) => (
    <div>
      <div className="CallbacksGrid__info-main">
        {moment.utc(callback[field]).local().format('DD.MM.YYYY')}
      </div>
      <div className="CallbacksGrid__info-secondary">
        {moment.utc(callback[field]).local().format('HH:mm:ss')}
      </div>
    </div>
  );

  renderStatus = ({ status }) => (
    <div
      className={
        classNames(
          'CallbacksGrid__info-main CallbacksGrid__status',
          `CallbacksGrid__status--${status.toLowerCase()}`,
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
        <Fragment>
          <div className="CallbacksGrid__info-main">
            {moment(reminderDate).format('DD.MM.YYYY')}
          </div>
          <div className="CallbacksGrid__info-secondary">
            {moment(reminderDate).format('HH:mm:ss')}
          </div>
        </Fragment>
      );
    }

    return (<div>&mdash;</div>);
  }

  render() {
    const {
      callbacksData,
      callbacksData: { loading },
    } = this.props;

    const callbacks = get(callbacksData, 'data.callbacks.data') || { content: [] };

    return (
      <div className="CallbacksGrid">
        <Grid
          data={callbacks.content}
          handleRowClick={this.handleOpenDetailsModal}
          handlePageChanged={this.handlePageChanged}
          isLoading={loading}
          isLastPage={callbacks.last}
          withRowsHover
          withLazyLoad
          lazyLoad
          withNoResults={callbacks.content.length === 0}
        >
          <GridColumn
            name="id"
            header={I18n.t('CALLBACKS.GRID_HEADER.ID')}
            render={this.renderId}
          />
          <GridColumn
            name="operatorId"
            header={I18n.t('CALLBACKS.GRID_HEADER.OPERATOR')}
            render={this.renderOperator}
          />
          <GridColumn
            name="userId"
            header={I18n.t('CALLBACKS.GRID_HEADER.CLIENT')}
            render={this.renderUser}
          />
          <GridColumn
            name="callbackTime"
            header={I18n.t('CALLBACKS.GRID_HEADER.TIME')}
            render={callback => this.renderDateTime(callback, 'callbackTime')}
          />
          <GridColumn
            name="creationTime"
            header={I18n.t('CALLBACKS.GRID_HEADER.CREATED')}
            render={callback => this.renderDateTime(callback, 'creationTime')}
          />
          <GridColumn
            name="updateTime"
            header={I18n.t('CALLBACKS.GRID_HEADER.MODIFIED')}
            render={callback => this.renderDateTime(callback, 'updateTime')}
          />
          <GridColumn
            name="status"
            header={I18n.t('CALLBACKS.GRID_HEADER.STATUS')}
            render={this.renderStatus}
          />
          <GridColumn
            header={I18n.t('CALLBACKS.GRID_HEADER.REMINDER')}
            render={this.renderReminder}
          />
          <GridColumn
            name="actions"
            header=""
            render={this.renderActions}
          />
        </Grid>
      </div>
    );
  }
}

export default withModals({
  callbackDetailsModal: CallbackDetailsModal,
})(CallbacksGrid);
