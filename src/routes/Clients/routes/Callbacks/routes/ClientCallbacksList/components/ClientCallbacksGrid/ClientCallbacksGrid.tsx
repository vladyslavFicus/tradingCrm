import React, { Fragment } from 'react';
import { cloneDeep, set } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Modal } from 'types';
import { ClientCallback } from '__generated__/types';
import withModals from 'hoc/withModals';
import { shortify } from 'utils/uuid';
import { targetTypes } from 'constants/note';
import { callbacksStatuses, CallbackTimes } from 'constants/callbacks';
import ClientCallbackDetailsModal from 'modals/ClientCallbackDetailsModal';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import NoteButton from 'components/NoteButton';
import {
  ClientCallbacksListQueryVariables,
  ClientCallbacksListQueryQueryResult,
} from '../../graphql/__generated__/ClientCallbacksListQuery';
import './ClientCallbacksGrid.scss';

type Props = {
  callbacksData: ClientCallbacksListQueryQueryResult,
  modals: {
    clientCallbackDetailsModal: Modal<{ callbackId: string }>,
  },
}

const CallbacksGrid = ({ callbacksData, modals }: Props) => {
  const { content = [], last = false } = callbacksData?.data?.clientCallbacks || {};

  const handlePageChanged = () => {
    const { data, variables, fetchMore, loading } = callbacksData;
    const page = data?.clientCallbacks?.page || 0;

    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as ClientCallbacksListQueryVariables), 'page', page + 1),
      });
    }
  };

  const handleClientClick = (userId: string) => {
    window.open(`/clients/${userId}/profile`, '_blank');
  };

  const renderId = ({ callbackId, operatorId }: ClientCallback) => (
    <Fragment>
      <div
        className="ClientCallbacksGrid__info-main ClientCallbacksGrid__info-main--pointer"
        onClick={() => modals.clientCallbackDetailsModal.show({ callbackId })}
      >
        {shortify(callbackId, 'CB')}
      </div>
      <div className="ClientCallbacksGrid__info-secondary">
        {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={operatorId} />
      </div>
    </Fragment>
  );

  const renderOperator = ({ operator, operatorId }: ClientCallback) => (
    <Fragment>
      <If condition={!!operator}>
        <div className="ClientCallbacksGrid__info-main">
          {operator?.fullName}
        </div>
      </If>
      <div className="ClientCallbacksGrid__info-secondary">
        <Uuid uuid={operatorId} />
      </div>
    </Fragment>
  );

  const renderUser = ({ client, userId }: ClientCallback) => (
    <div className="ClientCallbacksGrid__client">
      <If condition={!!client}>
        <div
          className="ClientCallbacksGrid__info-main"
          onClick={() => handleClientClick(userId)}
        >
          {client?.fullName}
        </div>
      </If>
      <div className="ClientCallbacksGrid__info-secondary">
        <Uuid uuid={userId} />
      </div>
    </div>
  );

  const renderDateTime = (callback: ClientCallback, field: CallbackTimes) => (
    <Fragment>
      <div className="ClientCallbacksGrid__info-main">
        {moment.utc(callback[field]).local().format('DD.MM.YYYY')}
      </div>
      <div className="ClientCallbacksGrid__info-secondary">
        {moment.utc(callback[field]).local().format('HH:mm:ss')}
      </div>
    </Fragment>
  );

  const renderStatus = ({ status }: ClientCallback) => (
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

  const renderActions = ({ callbackId, userId, note }: ClientCallback) => (
    <NoteButton
      key={callbackId}
      targetType={targetTypes.CLIENT_CALLBACK}
      targetUUID={callbackId}
      playerUUID={userId}
      note={note}
    />
  );

  const renderReminder = ({ reminder, callbackTime }: ClientCallback) => {
    if (reminder) {
      // Reminder format: ISO 8601('PT5M'), get milliseconds via moment.duration
      const reminderMilliseconds = moment.duration(reminder).asMilliseconds();
      const reminderDate = moment.utc(callbackTime).local().subtract(reminderMilliseconds, 'ms');

      return (
        <Fragment>
          <div className="ClientCallbacksGrid__info-main">
            {moment(reminderDate).format('DD.MM.YYYY')}
          </div>
          <div className="ClientCallbacksGrid__info-secondary">
            {moment(reminderDate).format('HH:mm:ss')}
          </div>
        </Fragment>
      );
    }

    return (<div>&mdash;</div>);
  };

  return (
    <div className="ClientCallbacksGrid">
      <Table
        stickyFromTop={128}
        items={content}
        loading={callbacksData.loading}
        hasMore={!last}
        onMore={handlePageChanged}
      >
        <Column
          header={I18n.t('CALLBACKS.GRID_HEADER.ID')}
          render={renderId}
        />
        <Column
          header={I18n.t('CALLBACKS.GRID_HEADER.OPERATOR')}
          render={renderOperator}
        />
        <Column
          header={I18n.t('CALLBACKS.GRID_HEADER.CLIENT')}
          render={renderUser}
        />
        <Column
          header={I18n.t('CALLBACKS.GRID_HEADER.TIME')}
          render={callback => renderDateTime(callback, 'callbackTime')}
        />
        <Column
          header={I18n.t('CALLBACKS.GRID_HEADER.CREATED')}
          render={callback => renderDateTime(callback, 'creationTime')}
        />
        <Column
          header={I18n.t('CALLBACKS.GRID_HEADER.MODIFIED')}
          render={callback => renderDateTime(callback, 'updateTime')}
        />
        <Column
          header={I18n.t('CALLBACKS.GRID_HEADER.STATUS')}
          render={renderStatus}
        />
        <Column
          header={I18n.t('CALLBACKS.GRID_HEADER.REMINDER')}
          render={renderReminder}
        />
        <Column
          header=""
          render={renderActions}
        />
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    clientCallbackDetailsModal: ClientCallbackDetailsModal,
  }),
)(CallbacksGrid);
