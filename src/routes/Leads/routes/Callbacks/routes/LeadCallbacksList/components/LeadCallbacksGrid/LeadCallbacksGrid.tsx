import React, { Fragment } from 'react';
import { cloneDeep, set } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Modal } from 'types';
import { LeadCallback } from '__generated__/types';
import withModals from 'hoc/withModals';
import { shortify } from 'utils/uuid';
import { targetTypes } from 'constants/note';
import { CallbackTimes } from 'constants/callbacks';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import { TrashButton } from 'components/Buttons';
import NoteAction from 'components/Note/NoteAction';
import LeadCallbackDetailsModal from 'modals/LeadCallbackDetailsModal';
import DeleteLeadCallbackModal from 'modals/DeleteLeadCallbackModal';
import {
  LeadCallbacksListQueryVariables,
  LeadCallbacksListQueryQueryResult,
} from '../../graphql/__generated__/LeadCallbacksListQuery';
import './LeadCallbacksGrid.scss';

type Props = {
  leadCallbacksListQuery: LeadCallbacksListQueryQueryResult,
  modals: {
    leadCallbackDetailsModal: Modal,
    deleteLeadCallbackModal: Modal,
  },
};

const LeadCallbacksGrid = (props: Props) => {
  const { leadCallbacksListQuery, modals } = props;
  const { leadCallbackDetailsModal, deleteLeadCallbackModal } = modals;

  const { data, variables, fetchMore, loading, refetch } = leadCallbacksListQuery;

  const { content = [], last = false } = leadCallbacksListQuery?.data?.leadCallbacks || {};

  // ===== Handlers ===== //
  const handlePageChanged = () => {
    const page = data?.leadCallbacks?.page || 0;

    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as LeadCallbacksListQueryVariables), 'page', page + 1),
      });
    }
  };

  const handleLeadClick = (userId: string) => {
    window.open(`/leads/${userId}/profile`, '_blank');
  };

  // ===== Renders ===== //
  const renderId = (callback: LeadCallback) => {
    const { callbackId, operatorId } = callback;

    return (
      <Fragment>
        <div
          className="LeadCallbacksGrid__info-main LeadCallbacksGrid__info-main--pointer"
          onClick={() => leadCallbackDetailsModal.show({
            callbackId,
            onDelete: () => deleteLeadCallbackModal.show({
              callback,
              onSuccess: leadCallbackDetailsModal.hide,
            }),
          })}
        >
          {shortify(callbackId, 'CB')}
        </div>

        <div className="LeadCallbacksGrid__info-secondary">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={operatorId} />
        </div>
      </Fragment>
    );
  };

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

  const renderUser = ({ lead, userId }: LeadCallback) => (
    <div className="LeadCallbacksGrid__lead">
      <If condition={!!lead}>
        <div
          className="LeadCallbacksGrid__info-main"
          onClick={() => handleLeadClick(userId)}
        >
          {lead?.fullName}
        </div>
      </If>

      <div className="LeadCallbacksGrid__info-secondary">
        <Uuid uuid={userId} />
      </div>
    </div>
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
      {I18n.t(`CONSTANTS.CALLBACKS.${status}`)}
    </div>
  );

  const renderActions = (callback: LeadCallback) => {
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

        <PermissionContent permissions={permissions.USER_PROFILE.DELETE_CALLBACK}>
          <TrashButton
            className="LeadCallbacksGrid__actions--remove"
            onClick={() => deleteLeadCallbackModal.show({ callback })}
          />
        </PermissionContent>
      </div>
    );
  };

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

    return (<div>&mdash;</div>);
  };

  return (
    <div className="LeadCallbacksGrid">
      <Table
        stickyFromTop={128}
        items={content}
        loading={loading}
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
          header={I18n.t('CALLBACKS.GRID_HEADER.LEAD')}
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
    leadCallbackDetailsModal: LeadCallbackDetailsModal,
    deleteLeadCallbackModal: DeleteLeadCallbackModal,
  }),
)(LeadCallbacksGrid);
