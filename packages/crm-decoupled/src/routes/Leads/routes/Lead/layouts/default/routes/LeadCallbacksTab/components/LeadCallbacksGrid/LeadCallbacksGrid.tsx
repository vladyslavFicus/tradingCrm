import React, { useCallback } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { TrashButton } from 'components';
import { Utils } from '@crm/common';
import { LeadCallback, Sort__Input as Sort } from '__generated__/types';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import NoteAction from 'components/Note/NoteAction';
import {
  LeadCallbacksListQueryQueryResult,
} from 'routes/Leads/routes/Lead/graphql/__generated__/LeadCallbacksListQuery';
import useLeadCallbacksGrid from 'routes/Leads/routes/Lead/hooks/useLeadCallbacksGrid';
import { CallbackTimes } from 'constants/callbacks';
import { targetTypes } from 'constants/note';
import './LeadCallbacksGrid.scss';

type Props = {
  sorts: Array<Sort>,
  onSort: (sorts: Array<Sort>) => void,
  leadCallbacksListQuery: LeadCallbacksListQueryQueryResult,
};

const LeadCallbacksGrid = (props: Props) => {
  const { sorts, onSort, leadCallbacksListQuery } = props;

  const {
    content,
    loading,
    last,
    refetch,
    allowDeleteCallback,
    handleOpenDeleteModal,
    handleOpenUpdateModal,
    handlePageChanged,
  } = useLeadCallbacksGrid({ leadCallbacksListQuery });

  // ===== Renders ===== //
  const renderId = useCallback((callback: LeadCallback) => {
    const { callbackId, operatorId } = callback;

    return (
      <>
        <div
          className="LeadCallbacksGrid__info-main LeadCallbacksGrid__info-main--pointer"
          onClick={() => handleOpenUpdateModal(callback)}
        >
          {Utils.uuidShortify(callbackId, 'CB')}
        </div>

        <div className="LeadCallbacksGrid__info-secondary">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={operatorId} />
        </div>
      </>
    );
  }, []);

  const renderOperator = useCallback(({ operator, operatorId }: LeadCallback) => (
    <>
      <If condition={!!operator}>
        <div className="LeadCallbacksGrid__info-main">
          {operator?.fullName}
        </div>
      </If>

      <div className="LeadCallbacksGrid__info-secondary">
        <Uuid uuid={operatorId} />
      </div>
    </>
  ), []);

  const renderDateTime = useCallback((callback: LeadCallback, field: CallbackTimes) => (
    <>
      <div className="LeadCallbacksGrid__info-main">
        {moment.utc(callback[field]).local().format('DD.MM.YYYY')}
      </div>

      <div className="LeadCallbacksGrid__info-secondary">
        {moment.utc(callback[field]).local().format('HH:mm:ss')}
      </div>
    </>
  ), []);

  const renderStatus = useCallback(({ status }: LeadCallback) => (
    <div
      className={
        classNames(
          'LeadCallbacksGrid__info-main LeadCallbacksGrid__status',
          `LeadCallbacksGrid__status--${status.toLowerCase()}`,
        )
      }
    >
      {I18n.t(`CONSTANTS.CALLBACKS.${status}`)}
    </div>
  ), []);

  const renderActions = useCallback((callback: LeadCallback) => {
    const { callbackId, userId, note } = callback;

    return (
      <div className="LeadCallbacksGrid__actions">
        <NoteAction
          note={note}
          playerUUID={userId}
          targetUUID={callbackId}
          targetType={targetTypes.LEAD_CALLBACK}
          onRefetch={refetch}
        />

        <If condition={allowDeleteCallback}>
          <TrashButton
            className="LeadCallbacksGrid__actions--remove"
            data-testid="LeadCallbacksGrid-trashButton"
            onClick={() => handleOpenDeleteModal(callback)}
          />
        </If>
      </div>
    );
  }, [allowDeleteCallback]);

  const renderReminder = useCallback(({ reminder, callbackTime }: LeadCallback) => {
    if (reminder) {
      // Reminder format: ISO 8601('PT5M'), get milliseconds via moment.duration
      const reminderMilliseconds = moment.duration(reminder).asMilliseconds();
      const reminderDate = moment.utc(callbackTime).local().subtract(reminderMilliseconds, 'ms');

      return (
        <>
          <div className="LeadCallbacksGrid__info-main">
            {moment(reminderDate).format('DD.MM.YYYY')}
          </div>

          <div className="LeadCallbacksGrid__info-secondary">
            {moment(reminderDate).format('HH:mm:ss')}
          </div>
        </>
      );
    }

    return <div>&mdash;</div>;
  }, []);

  return (
    <div className="LeadCallbacksGrid">
      <Table
        stickyFromTop={188}
        items={content}
        loading={loading}
        hasMore={!last}
        onMore={handlePageChanged}
        onSort={onSort}
        sorts={sorts}
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

export default React.memo(LeadCallbacksGrid);
