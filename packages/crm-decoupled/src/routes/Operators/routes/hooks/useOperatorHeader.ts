import { useCallback } from 'react';
import I18n from 'i18n-js';
import { Config, Utils } from '@crm/common';
import { parseErrors } from 'apollo';
import { Operator } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import ChangePasswordModal, { ChangePasswordModalProps } from 'modals/ChangePasswordModal';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { passwordPattern, passwordMaxSize, passwordCustomError } from 'constants/operators';
import { useOperatorLockStatusQuery } from '../graphql/__generated__/OperatorLockStatusQuery';
import { useChangeOperatorPasswordMutation } from '../graphql/__generated__/ChangeOperatorPasswordMutation';
import { useResetOperatorPasswordMutation } from '../graphql/__generated__/ResetOperatorPasswordMutation';
import { useUnlockOperatorLoginMutation } from '../graphql/__generated__/UnlockOperatorLoginMutation';

type Props = {
  operator: Operator,
};

type UseOperatorHeader = {
  allowResetPassword: boolean,
  allowChangePassword: boolean,
  isLock: boolean,
  handleUnlockOperatorLogin: () => void,
  handleOpenResetPasswordModal: () => void,
  handleOpenChangePasswordModal: () => void,
};

const useOperatorHeader = (props: Props): UseOperatorHeader => {
  const {
    operator: {
      operatorStatus,
      fullName,
      uuid,
    },
  } = props;

  const permission = usePermission();

  const allowResetPassword = permission.allows(Config.permissions.OPERATORS.RESET_PASSWORD);
  const allowChangePassword = permission.allows(Config.permissions.OPERATORS.CHANGE_PASSWORD);

  // ===== Modals ===== //
  const changePasswordModal = useModal<ChangePasswordModalProps>(ChangePasswordModal);
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  // ===== Requests ===== //
  const { data, refetch } = useOperatorLockStatusQuery({ variables: { uuid }, fetchPolicy: 'network-only' });

  const locks = data?.loginLock;
  const isLock = !!locks && Utils.isMaxLoginAttemptReached(locks) && operatorStatus !== 'CLOSED';

  const [changeOperatorPasswordMutation] = useChangeOperatorPasswordMutation();
  const [resetOperatorPasswordMutation] = useResetOperatorPasswordMutation();
  const [unlockOperatorLoginMutation] = useUnlockOperatorLoginMutation();

  // ===== Handlers ===== //
  const handleUnlockOperatorLogin = useCallback(async () => {
    try {
      await unlockOperatorLoginMutation({ variables: { uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.SUCCESS.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.SUCCESS.MESSAGE'),
      });

      refetch();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.ERROR.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.ERROR.MESSAGE'),
      });
    }
  }, []);

  const handleResetPassword = useCallback(async () => {
    try {
      await resetOperatorPasswordMutation({ variables: { uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.RESET_PASSWORD.SUCCESS.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.RESET_PASSWORD.SUCCESS.MESSAGE'),
      });

      confirmActionModal.hide();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.RESET_PASSWORD.ERROR.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.RESET_PASSWORD.ERROR.MESSAGE'),
      });
    }
  }, [uuid]);

  const handleOpenResetPasswordModal = useCallback(() => {
    confirmActionModal.show({
      onSubmit: handleResetPassword,
      modalTitle: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.TITLE'),
      actionText: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TEXT'),
      additionalText: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TARGET'),
      submitButtonLabel: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.CONFIRM_ACTION'),
      fullName: fullName as string,
      uuid,
    });
  }, [fullName, uuid]);

  const handleChangePassword = async ({ newPassword }: {newPassword: string}) => {
    try {
      await changeOperatorPasswordMutation({ variables: { uuid, newPassword } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_PASSWORD.SUCCESS.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_PASSWORD.SUCCESS.MESSAGE'),
      });

      changePasswordModal.hide();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_PASSWORD.ERROR.TITLE'),
        message: I18n.t(
          error.error,
          { defaultValue: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_PASSWORD.ERROR.MESSAGE') },
        ),
      });
    }
  };

  const handleOpenChangePasswordModal = useCallback(() => {
    changePasswordModal.show({
      onSubmit: handleChangePassword,
      fullName: fullName || '',
      uuid,
      passwordPattern: passwordPattern.toString(),
      passwordMaxSize,
      passwordCustomError,
    });
  }, [fullName, uuid]);

  return {
    allowResetPassword,
    allowChangePassword,
    isLock,
    handleUnlockOperatorLogin,
    handleOpenResetPasswordModal,
    handleOpenChangePasswordModal,
  };
};

export default useOperatorHeader;
