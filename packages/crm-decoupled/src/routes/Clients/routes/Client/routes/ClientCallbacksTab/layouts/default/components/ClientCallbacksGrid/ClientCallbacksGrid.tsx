import React, { useCallback } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Utils } from '@crm/common';
import { TrashButton } from 'components';
import { ClientCallback, Sort__Input as Sort } from '__generated__/types';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import NoteAction from 'components/Note/NoteAction';
import {
  ClientCallbacksListQueryQueryResult,
} from 'routes/Clients/routes/Client/routes/ClientCallbacksTab/graphql/__generated__/ClientCallbacksListQuery';
import useClientCallbacksGrid
  from 'routes/Clients/routes/Client/routes/ClientCallbacksTab/hooks/useClientCallbacksGrid';
import { CallbackTimes } from 'constants/callbacks';
import { targetTypes } from 'constants/note';
import './ClientCallbacksGrid.scss';

type Props = {
  sorts: Array<Sort>,
  onSort: (sorts: Array<Sort>) => void,
  clientCallbacksListQuery: ClientCallbacksListQueryQueryResult,
};

const ClientCallbacksGrid = (props: Props) => {
  const { sorts, onSort, clientCallbacksListQuery } = props;

  const {
    loading,
    handlePageChanged,
    refetch,
    content,
    last,
    handleOpenUpdateModal,
    handleOpenDeleteModal,
    allowDeleteCallback,
  } = useClientCallbacksGrid({ clientCallbacksListQuery });

  // ===== Renders ===== //
  const renderId = useCallback((callback: ClientCallback) => {
    const { callbackId, operatorId } = callback;

    return (
      <>
        <div
          className="ClientCallbacksGrid__info-main ClientCallbacksGrid__info-main--pointer"
          onClick={() => handleOpenUpdateModal(callback)}
        >
          {Utils.uuidShortify(callbackId, 'CB')}
        </div>

        <div className="ClientCallbacksGrid__info-secondary">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={operatorId} />
        </div>
      </>
    );
  }, []);

  const renderOperator = useCallback(({ operator, operatorId }: ClientCallback) => (
    <>
      <If condition={!!operator}>
        <div className="ClientCallbacksGrid__info-main">
          {operator?.fullName}
        </div>
      </If>

      <div className="ClientCallbacksGrid__info-secondary">
        <Uuid uuid={operatorId} />
      </div>
    </>
  ), []);

  const renderDateTime = useCallback((callback: ClientCallback, field: CallbackTimes) => (
    <>
      <div className="ClientCallbacksGrid__info-main">
        {moment.utc(callback[field]).local().format('DD.MM.YYYY')}
      </div>

      <div className="ClientCallbacksGrid__info-secondary">
        {moment.utc(callback[field]).local().format('HH:mm:ss')}
      </div>
    </>
  ), []);

  const renderStatus = useCallback(({ status }: ClientCallback) => (
    <div
      className={
        classNames(
          'ClientCallbacksGrid__info-main ClientCallbacksGrid__status',
          `ClientCallbacksGrid__status--${status.toLowerCase()}`,
        )
      }
    >
      {I18n.t(`CONSTANTS.CALLBACKS.${status}`)}
    </div>
  ), []);

  const renderActions = useCallback((callback: ClientCallback) => {
    const { callbackId, userId, note } = callback;

    return (
      <div className="ClientCallbacksGrid__actions">
        <NoteAction
          note={note}
          playerUUID={userId}
          targetUUID={callbackId}
          targetType={targetTypes.CLIENT_CALLBACK}
          onRefetch={refetch}
        />

        <If condition={allowDeleteCallback}>
          <TrashButton
            className="ClientCallbacksGrid__actions--remove"
            data-testid="ClientCallbacksGrid-trashButton"
            onClick={() => handleOpenDeleteModal(callback)}
          />
        </If>
      </div>
    );
  }, [refetch, allowDeleteCallback]);

  const renderReminder = useCallback(({ reminder, callbackTime }: ClientCallback) => {
    if (!reminder) {
      return <>&mdash;</>;
    }

    // Reminder format: ISO 8601('PT5M'), get milliseconds via moment.duration
    const reminderMilliseconds = moment.duration(reminder).asMilliseconds();
    const reminderDate = moment.utc(callbackTime).local().subtract(reminderMilliseconds, 'ms');

    return (
      <>
        <div className="ClientCallbacksGrid__info-main">
          {moment(reminderDate).format('DD.MM.YYYY')}
        </div>

        <div className="ClientCallbacksGrid__info-secondary">
          {moment(reminderDate).format('HH:mm:ss')}
        </div>
      </>
    );
  }, []);

  return (
    <div className="ClientCallbacksGrid">
      <Table
        stickyFromTop={188}
        items={content}
        loading={loading}
        hasMore={!last}
        onMore={handlePageChanged}
        sorts={sorts}
        onSort={onSort}
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
          header={I18n.t('CALLBACKS.GRID_HEADER.TIME')}
          render={callback => renderDateTime(callback, 'callbackTime')}
          sortBy="callbackTime"
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

export default React.memo(ClientCallbacksGrid);
