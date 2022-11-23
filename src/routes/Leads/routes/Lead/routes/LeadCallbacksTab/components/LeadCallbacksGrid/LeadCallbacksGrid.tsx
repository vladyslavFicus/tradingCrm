import React, { Fragment } from 'react';
import compose from 'compose-function';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { cloneDeep, set } from 'lodash';
import { Modal } from 'types';
import { withModals } from 'hoc';
import { LeadCallback } from '__generated__/types';
import { shortify } from 'utils/uuid';
import { targetTypes } from 'constants/note';
import { callbacksStatuses, CallbackTimes } from 'constants/callbacks';
import { Table, Column } from 'components/Table';
import NoteButton from 'components/NoteButton';
import Uuid from 'components/Uuid';
import LeadCallbackDetailsModal from 'modals/LeadCallbackDetailsModal';
import {
  LeadCallbacksQueryQueryResult,
  LeadCallbacksQueryVariables,
} from '../../graphql/__generated__/LeadCallbacksQuery';
import './LeadCallbacksGrid.scss';

type Props = {
  leadCallbacksQuery: LeadCallbacksQueryQueryResult,
  modals: {
    leadCallbackDetailsModal: Modal<{ callbackId: string }>
  }
};

const LeadCallbacksGrid = (props: Props) => {
  const { leadCallbacksQuery, modals } = props;
  const { content = [], last = false } = leadCallbacksQuery?.data?.leadCallbacks || {};

  const handlePageChanged = () => {
    const { data, variables, fetchMore } = leadCallbacksQuery;
    const page = data?.leadCallbacks?.page || 0;

    fetchMore({
      variables: set(cloneDeep(variables as LeadCallbacksQueryVariables), 'page', page + 1),
    });
  };

  const renderId = ({ callbackId, operatorId }: LeadCallback) => (
    <Fragment>
      <div
        className="LeadCallbacksGrid__info-main LeadCallbacksGrid__info-main--pointer"
        onClick={() => modals.leadCallbackDetailsModal.show({ callbackId })}
      >
        {shortify(callbackId, 'CB')}
      </div>
      <div className="LeadCallbacksGrid__info-secondary">
        {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={operatorId} />
      </div>
    </Fragment>
  );

  const renderOperator = ({ operator, operatorId }: LeadCallback) => (
    <Fragment>
      <If condition={!!operator}>
        <div className="LeadCallbacksGrid__info-main">
          {operator?.fullName}
        </div>
      </If>
      <div className="LeadCallbacksGrid__info-secondary">
        <Uuid uuid={operatorId} />
      </div>
    </Fragment>
  );

  const renderDateTime = (callback: LeadCallback, field: CallbackTimes) => (
    <Fragment>
      <div className="LeadCallbacksGrid__info-main">
        {moment.utc(callback[field]).local().format('DD.MM.YYYY')}
      </div>
      <div className="LeadCallbacksGrid__info-secondary">
        {moment.utc(callback[field]).local().format('HH:mm:ss')}
      </div>
    </Fragment>
  );

  const renderStatus = ({ status }: LeadCallback) => (
    <div
      className={
        classNames(
          'LeadCallbacksGrid__info-main LeadCallbacksGrid__status',
          `LeadCallbacksGrid__status--${status.toLowerCase()}`,
        )
      }
    >
      {I18n.t(callbacksStatuses[status])}
    </div>
  );

  const renderActions = ({ callbackId, userId, note }: LeadCallback) => (
    <NoteButton
      key={callbackId}
      targetType={targetTypes.LEAD_CALLBACK}
      targetUUID={callbackId}
      playerUUID={userId}
      note={note}
    />
  );

  const renderReminder = ({ reminder, callbackTime }: LeadCallback) => {
    if (reminder) {
      // Reminder format: ISO 8601('PT5M'), get milliseconds via moment.duration
      const reminderMilliseconds = moment.duration(reminder).asMilliseconds();
      const reminderDate = moment.utc(callbackTime).local().subtract(reminderMilliseconds, 'ms');

      return (
        <Fragment>
          <div className="LeadCallbacksGrid__info-main">
            {moment(reminderDate).format('DD.MM.YYYY')}
          </div>
          <div className="LeadCallbacksGrid__info-secondary">
            {moment(reminderDate).format('HH:mm:ss')}
          </div>
        </Fragment>
      );
    }

    return <div>&mdash;</div>;
  };

  return (
    <div className="LeadCallbacksGrid">
      <Table
        stickyFromTop={188}
        items={content}
        loading={leadCallbacksQuery?.loading}
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
    leadCallbackDetailsModal: LeadCallbackDetailsModal,
  }),
)(LeadCallbacksGrid);
