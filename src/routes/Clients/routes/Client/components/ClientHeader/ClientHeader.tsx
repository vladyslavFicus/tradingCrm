import React, { useState } from 'react';
import compose from 'compose-function';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import { targetTypes } from 'constants/note';
import permissions from 'config/permissions';
import customTimeout from 'utils/customTimeout';
import { isMaxLoginAttemptReached } from 'utils/profileLock';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import ChangePasswordModal from 'modals/ChangePasswordModal';
import CreateClientCallbackModal, { CreateClientCallbackModalProps } from 'modals/CreateClientCallbackModal';
import ActionsDropDown from 'components/ActionsDropDown';
import { Button } from 'components/Buttons';
import Uuid from 'components/Uuid';
import NoteAction from 'components/Note/NoteAction';
import { AuthMutationChangePasswordArgs, LoginLock, Profile } from '__generated__/types';
import { Modal } from 'types';
import { useClientLockStatusQuery } from './graphql/__generated__/ClientLockStatusQuery';
import { useClientUnlockLoginMutation } from './graphql/__generated__/ClientUnlockLoginMutation';
import { useClientResetPasswordMutation } from './graphql/__generated__/ClientResetPasswordMutation';
import { useClientChangePasswordMutation } from './graphql/__generated__/ClientChangePasswordMutation';
import './ClientHeader.scss';

type Modals = {
  confirmActionModal: Modal,
  changePasswordModal: Modal,
}

type Props = {
  client: Profile,
  modals: Modals,
};

const ClientHeader = (props: Props) => {
  const {
    client: {
      age,
      uuid,
      status,
      lastName,
      firstName,
      profileVerified,
    },
    modals: {
      confirmActionModal,
      changePasswordModal,
    },
  } = props;

  const [runningReloadAnimation, setRunningReloadAnimation] = useState<boolean>(false);

  const permission = usePermission();

  const { data, refetch } = useClientLockStatusQuery({
    variables: { playerUUID: uuid },
  });
  const locks = data?.loginLock;

  const [clientUnlockLoginMutation] = useClientUnlockLoginMutation();
  const [clientResetPasswordMutation] = useClientResetPasswordMutation();
  const [clientChangePasswordMutation] = useClientChangePasswordMutation();

  const createClientCallbackModal = useModal<CreateClientCallbackModalProps>(CreateClientCallbackModal);

  const onHandleReloadClick = () => {
    setRunningReloadAnimation(true);
    customTimeout(() => {
      setRunningReloadAnimation(false);
    }, 1000);

    EventEmitter.emit(CLIENT_RELOAD);
  };

  const handleUnlockClientLogin = async () => {
    try {
      // # Unlock client's ability to login
      await clientUnlockLoginMutation({ variables: { playerUUID: uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.MESSAGE'),
      });

      refetch();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.MESSAGE'),
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      await clientResetPasswordMutation({ variables: { playerUUID: uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.NOTIFICATION_TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.SUCCESS_NOTIFICATION_TEXT'),
      });

      confirmActionModal.hide();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.NOTIFICATION_TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.ERROR_NOTIFICATION_TEXT'),
      });
    }
  };

  const handleOpenResetPasswordModal = () => {
    confirmActionModal.show({
      uuid,
      onSubmit: handleResetPassword,
      fullName: `${firstName} ${lastName}`,
      modalTitle: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TITLE'),
      actionText: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TEXT'),
      submitButtonLabel: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.BUTTON_ACTION'),
    });
  };

  const handleChangePassword = async ({ newPassword }: AuthMutationChangePasswordArgs) => {
    try {
      await clientChangePasswordMutation({ variables: { newPassword, clientUuid: uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.MESSAGE'),
      });

      changePasswordModal.hide();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.TITLE'),
        message: I18n.t(
          error.error,
          { defaultValue: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.MESSAGE') },
        ),
      });
    }
  };

  const handleOpenChangePasswordModal = () => {
    changePasswordModal.show({
      uuid,
      fullName: `${firstName} ${lastName}`,
      onSubmit: handleChangePassword,
    });
  };

  const handleOpenAddCallbackModal = () => {
    createClientCallbackModal.show();
  };

  return (
    <div className="ClientHeader">
      <div className="ClientHeader__topic">
        <div className="ClientHeader__title">
          <span>{`${firstName} ${lastName}`}</span>

          <span>{` (${age || '?'}) `}</span>

          <If condition={profileVerified}>
            <i className="fa fa-check ClientHeader__title-verified" />
          </If>
        </div>

        <If condition={!!uuid}>
          <div className="ClientHeader__uuid">
            <Uuid uuid={uuid} uuidPrefix="PL" />
          </div>
        </If>
      </div>

      <div className="ClientHeader__actions">
        <If condition={permission.allows(permissions.USER_PROFILE.CREATE_CALLBACK)}>
          <Button
            data-testid="addCallbackButton"
            small
            tertiary
            className="ClientHeader__action"
            onClick={handleOpenAddCallbackModal}
          >
            {I18n.t('CLIENT_PROFILE.CALLBACKS.ADD_CALLBACK')}
          </Button>
        </If>

        <If condition={isMaxLoginAttemptReached(locks as LoginLock) && status?.type !== 'BLOCKED'}>
          <Button
            className="ClientHeader__action"
            onClick={handleUnlockClientLogin}
            tertiary
            small
          >
            {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.UNLOCK')}
          </Button>
        </If>

        <If condition={permission.allows(permissions.NOTES.ADD_NOTE)}>
          <NoteAction
            playerUUID={uuid}
            targetUUID={uuid}
            targetType={targetTypes.PLAYER}
            placement="bottom-end"
          >
            <Button
              data-testid="addNoteButton"
              className="ClientHeader__action"
              tertiary
              small
            >
              {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.ADD_NOTE')}
            </Button>
          </NoteAction>
        </If>

        <Button
          data-testid="refreshButton"
          className="ClientHeader__action"
          onClick={onHandleReloadClick}
          tertiary
          small
        >
          <i
            className={classNames('fa fa-refresh ClientHeader__icon', {
              'ClientHeader__icon--spin': runningReloadAnimation,
            })}
          />
        </Button>

        <ActionsDropDown
          className="ClientHeader__action"
          classNameMenu="dropdown-over-sticky"
          items={[
            {
              label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.RESET_PASSWORD'),
              onClick: handleOpenResetPasswordModal,
              permission: permissions.USER_PROFILE.RESET_PASSWORD,
            },
            {
              label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
              onClick: handleOpenChangePasswordModal,
              permission: permissions.USER_PROFILE.CHANGE_PASSWORD,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    confirmActionModal: ConfirmActionModal,
    changePasswordModal: ChangePasswordModal,
  }),
)(ClientHeader);
