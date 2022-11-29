import React, { Fragment } from 'react';
import compose from 'compose-function';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { cloneDeep, set } from 'lodash';
import { Modal } from 'types';
import { withModals } from 'hoc';
import { ClientCallback } from '__generated__/types';
import { shortify } from 'utils/uuid';
import { targetTypes } from 'constants/note';
import { callbacksStatuses, CallbackTimes } from 'constants/callbacks';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import { Table, Column } from 'components/Table';
import { TrashButton } from 'components/UI';
import NoteButton from 'components/NoteButton';
import Uuid from 'components/Uuid';
import ClientCallbackDetailsModal from 'modals/ClientCallbackDetailsModal';
import DeleteClientCallbackModal from 'modals/DeleteClientCallbackModal';
import {
  ClientCallbacksQueryQueryResult,
  ClientCallbacksQueryVariables,
} from '../../graphql/__generated__/ClientCallbacksQuery';
import './ClientCallbacksGrid.scss';

type Props = {
  clientCallbacksQuery: ClientCallbacksQueryQueryResult,
  modals: {
    clientCallbackDetailsModal: Modal,
    deleteClientCallbackModal: Modal,
  },
};

const ClientCallbacksGrid = (props: Props) => {
  const { clientCallbacksQuery, modals } = props;
  const { clientCallbackDetailsModal, deleteClientCallbackModal } = modals;
  const { content = [], last = false } = clientCallbacksQuery?.data?.clientCallbacks || {};

  const handlePageChanged = () => {
    const { data, variables, fetchMore } = clientCallbacksQuery;
    const page = data?.clientCallbacks?.page || 0;

    fetchMore({
      variables: set(cloneDeep(variables as ClientCallbacksQueryVariables), 'page', page + 1),
    });
  };

  const renderId = (callback: ClientCallback) => {
    const { callbackId, operatorId } = callback;

    return (
      <Fragment>
        <div
          className="ClientCallbacksGrid__info-main ClientCallbacksGrid__info-main--pointer"
          onClick={() => clientCallbackDetailsModal.show({
            callbackId,
            onDelete: () => deleteClientCallbackModal.show({
              callback,
              onSuccess: clientCallbackDetailsModal.hide,
            }),
          })}
        >
          {shortify(callbackId, 'CB')}
        </div>

        <div className="ClientCallbacksGrid__info-secondary">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={operatorId} />
        </div>
      </Fragment>
    );
  };

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

  const renderActions = (callback: ClientCallback) => {
    const { callbackId, userId, note } = callback;

    return (
      <Fragment>
        <NoteButton
          key={callbackId}
          targetType={targetTypes.CLIENT_CALLBACK}
          targetUUID={callbackId}
          playerUUID={userId}
          note={note}
        />
        <PermissionContent permissions={permissions.USER_PROFILE.DELETE_CALLBACK}>
          <TrashButton
            className="ClientCallbacksGrid__trash"
            onClick={() => deleteClientCallbackModal.show({ callback })}
          />
        </PermissionContent>
      </Fragment>
    );
  };

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

    return <div>&mdash;</div>;
  };

  return (
    <div className="ClientCallbacksGrid">
      <Table
        stickyFromTop={188}
        items={content}
        loading={clientCallbacksQuery?.loading}
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
    clientCallbackDetailsModal: ClientCallbackDetailsModal,
    deleteClientCallbackModal: DeleteClientCallbackModal,
  }),
)(ClientCallbacksGrid);
