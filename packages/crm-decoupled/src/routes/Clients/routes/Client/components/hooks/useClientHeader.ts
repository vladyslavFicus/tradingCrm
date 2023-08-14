import { useCallback, useState } from 'react';
import I18n from 'i18n-js';
import { Config, Utils, Types, useModal, notify, usePermission, parseErrors } from '@crm/common';
import { LoginLock } from '__generated__/types';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import CreateClientCallbackModal, { CreateClientCallbackModalProps } from 'modals/CreateClientCallbackModal';
import ChangePasswordModal, { ChangePasswordModalProps, FormValues } from 'modals/ChangePasswordModal';
import { useClientLockStatusQuery } from '../graphql/__generated__/ClientLockStatusQuery';
import { useClientUnlockLoginMutation } from '../graphql/__generated__/ClientUnlockLoginMutation';
import { useClientResetPasswordMutation } from '../graphql/__generated__/ClientResetPasswordMutation';
import { useClientChangePasswordMutation } from '../graphql/__generated__/ClientChangePasswordMutation';

type Props = {
  uuid: string,
  firstName: string,
  lastName: string,
};

type Item = {
  label: string,
  permission: string,
  onClick: () => void,
};

type UseClientHeader = {
  locks: LoginLock,
  items: Array<Item>,
  allowAddNote: boolean,
  allowCreateCallback: boolean,
  runningReloadAnimation: boolean,
  handleOpenAddCallbackModal: () => void,
  handleUnlockClientLogin: () => void,
  handleReloadClick: () => void,
};

const useClientHeader = (props: Props): UseClientHeader => {
  const { uuid, firstName, lastName } = props;
  const [runningReloadAnimation, setRunningReloadAnimation] = useState<boolean>(false);

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowCreateCallback = permission.allows(Config.permissions.USER_PROFILE.CREATE_CALLBACK);
  const allowAddNote = permission.allows(Config.permissions.NOTES.ADD_NOTE);

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const createClientCallbackModal = useModal<CreateClientCallbackModalProps>(CreateClientCallbackModal);
  const changePasswordModal = useModal<ChangePasswordModalProps>(ChangePasswordModal);

  // ===== Requests ===== //
  const { data, refetch } = useClientLockStatusQuery({
    variables: { playerUUID: uuid },
  });
  const locks = data?.loginLock as LoginLock;

  const [clientUnlockLoginMutation] = useClientUnlockLoginMutation();
  const [clientResetPasswordMutation] = useClientResetPasswordMutation();
  const [clientChangePasswordMutation] = useClientChangePasswordMutation();

  // ===== Handlers ===== //
  const handleReloadClick = useCallback(() => {
    setRunningReloadAnimation(true);
    Utils.customTimeout(() => {
      setRunningReloadAnimation(false);
    }, 1000);

    Utils.EventEmitter.emit(Utils.CLIENT_RELOAD);
  }, []);

  const handleUnlockClientLogin = useCallback(async () => {
    try {
      // # Unlock client's ability to login
      await clientUnlockLoginMutation({ variables: { playerUUID: uuid } });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.MESSAGE'),
      });

      refetch();
    } catch (e) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.MESSAGE'),
      });
    }
  }, [clientUnlockLoginMutation, refetch, uuid]);

  const handleResetPassword = useCallback(async () => {
    try {
      await clientResetPasswordMutation({ variables: { playerUUID: uuid } });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.NOTIFICATION_TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.SUCCESS_NOTIFICATION_TEXT'),
      });

      confirmActionModal.hide();
    } catch (e) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.NOTIFICATION_TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.ERROR_NOTIFICATION_TEXT'),
      });
    }
  }, [clientResetPasswordMutation, confirmActionModal, uuid]);

  const handleOpenResetPasswordModal = useCallback(() => {
    confirmActionModal.show({
      uuid,
      onSubmit: handleResetPassword,
      fullName: `${firstName} ${lastName}`,
      modalTitle: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TITLE'),
      actionText: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TEXT'),
      submitButtonLabel: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.BUTTON_ACTION'),
    });
  }, [confirmActionModal, firstName, handleResetPassword, lastName, uuid]);

  const handleChangePassword = useCallback(async ({ newPassword }: FormValues) => {
    try {
      await clientChangePasswordMutation({ variables: { newPassword, clientUuid: uuid } });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.MESSAGE'),
      });

      changePasswordModal.hide();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.TITLE'),
        message: I18n.t(
          error.error,
          { defaultValue: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.MESSAGE') },
        ),
      });
    }
  }, [changePasswordModal, clientChangePasswordMutation, uuid]);

  const handleOpenChangePasswordModal = useCallback(() => {
    changePasswordModal.show({
      uuid,
      fullName: `${firstName} ${lastName}`,
      onSubmit: handleChangePassword,
    });
  }, [changePasswordModal, firstName, handleChangePassword, lastName, uuid]);

  // TODO there is a problem with NotePopover
  const handleOpenAddCallbackModal = useCallback(() => {
    createClientCallbackModal.show({
      userId: uuid,
    });
  }, [createClientCallbackModal, uuid]);

  const items = [
    {
      label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.RESET_PASSWORD'),
      onClick: handleOpenResetPasswordModal,
      permission: Config.permissions.USER_PROFILE.RESET_PASSWORD,
    },
    {
      label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
      onClick: handleOpenChangePasswordModal,
      permission: Config.permissions.USER_PROFILE.CHANGE_PASSWORD,
    },
  ];

  return {
    locks,
    items,
    allowAddNote,
    allowCreateCallback,
    handleOpenAddCallbackModal,
    handleUnlockClientLogin,
    handleReloadClick,
    runningReloadAnimation,
  };
};

export default useClientHeader;
