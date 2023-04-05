import React from 'react';
import { cloneDeep, set } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { ClientCallback, Sort__Input as Sort } from '__generated__/types';
import { shortify } from 'utils/uuid';
import { useModal } from 'providers/ModalProvider';
import { targetTypes } from 'constants/note';
import { CallbackTimes } from 'constants/callbacks';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import { TrashButton } from 'components/Buttons';
import NoteAction from 'components/Note/NoteAction';
import UpdateClientCallbackModal, { UpdateClientCallbackModalProps } from 'modals/UpdateClientCallbackModal';
import DeleteClientCallbackModal, { DeleteClientCallbackModalProps } from 'modals/DeleteClientCallbackModal';
import {
  ClientCallbacksListQueryVariables,
  ClientCallbacksListQueryQueryResult,
} from '../../graphql/__generated__/ClientCallbacksListQuery';
import './ClientCallbacksGrid.scss';

type Props = {
  sorts: Array<Sort>,
  onSort: (sorts: Array<Sort>) => void,
  clientCallbacksListQuery: ClientCallbacksListQueryQueryResult,
};

const ClientCallbacksGrid = (props: Props) => {
  const { sorts, onSort, clientCallbacksListQuery } = props;

  const { data, variables, fetchMore, loading, refetch } = clientCallbacksListQuery;

  const { content = [], last = false } = clientCallbacksListQuery?.data?.clientCallbacks || {};

  // ===== Modals ===== //
  const updateClientCallbackModal = useModal<UpdateClientCallbackModalProps>(UpdateClientCallbackModal);
  const deleteClientCallbackModal = useModal<DeleteClientCallbackModalProps>(DeleteClientCallbackModal);

  // ===== Handlers ===== //
  const handlePageChanged = () => {
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

  // ===== Renders ===== //
  const renderId = (callback: ClientCallback) => {
    const { callbackId, operatorId } = callback;

    return (
      <>
        <div
          className="ClientCallbacksGrid__info-main ClientCallbacksGrid__info-main--pointer"
          onClick={() => updateClientCallbackModal.show({
            callbackId,
            onDelete: () => deleteClientCallbackModal.show({
              callback,
              onSuccess: updateClientCallbackModal.hide,
            }),
          })}
        >
          {shortify(callbackId, 'CB')}
        </div>

        <div className="ClientCallbacksGrid__info-secondary">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={operatorId} />
        </div>
      </>
    );
  };

  const renderOperator = ({ operator, operatorId }: ClientCallback) => (
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
    <>
      <div className="ClientCallbacksGrid__info-main">
        {moment.utc(callback[field]).local().format('DD.MM.YYYY')}
      </div>

      <div className="ClientCallbacksGrid__info-secondary">
        {moment.utc(callback[field]).local().format('HH:mm:ss')}
      </div>
    </>
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
      {I18n.t(`CONSTANTS.CALLBACKS.${status}`)}
    </div>
  );

  const renderActions = (callback: ClientCallback) => {
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

        <PermissionContent permissions={permissions.USER_PROFILE.DELETE_CALLBACK}>
          <TrashButton
            className="ClientCallbacksGrid__actions--remove"
            onClick={() => deleteClientCallbackModal.show({ callback })}
          />
        </PermissionContent>
      </div>
    );
  };

  const renderReminder = ({ reminder, callbackTime }: ClientCallback) => {
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
  };

  return (
    <div className="ClientCallbacksGrid">
      <Table
        stickyFromTop={128}
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
          header={I18n.t('CALLBACKS.GRID_HEADER.CLIENT')}
          render={renderUser}
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
