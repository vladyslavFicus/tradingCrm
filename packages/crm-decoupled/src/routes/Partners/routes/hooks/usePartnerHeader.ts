import { useCallback } from 'react';
import I18n from 'i18n-js';
import { permissions } from 'config';
import { parseErrors } from 'apollo';
import { Partner } from '__generated__/types';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { isMaxLoginAttemptReached } from 'utils/profileLock';
import ChangePasswordModal, { ChangePasswordModalProps } from 'modals/ChangePasswordModal';
import { usePartnerLockStatusQuery } from '../graphql/__generated__/PartnerLockStatusQuery';
import { useChangePartnerPasswordMutation } from '../graphql/__generated__/ChangePartnerPasswordMutation';
import { useUnlockPartnerLoginMutation } from '../graphql/__generated__/UnlockPartnerLoginMutation';

type Props = {
  partner: Partner,
};

type PartnerHeader = {
  allowChangePassword: boolean,
  isLock: boolean,
  handleUnlockPartnerLogin: () => void,
  handleOpenChangePasswordModal: () => void,
};

const usePartnerHeader = (props: Props): PartnerHeader => {
  const {
    partner: {
      fullName,
      uuid,
      status,
    },
  } = props;

  const changePasswordModal = useModal<ChangePasswordModalProps>(ChangePasswordModal);

  const permission = usePermission();

  const allowChangePassword = permission.allows(permissions.PARTNERS.CHANGE_PASSWORD);

  // ===== Requests ===== //
  const { data, refetch } = usePartnerLockStatusQuery({ variables: { uuid }, fetchPolicy: 'network-only' });

  const locks = data?.loginLock;
  const isLock = !!locks && isMaxLoginAttemptReached(locks) && status !== 'CLOSED';

  const [changePartnerPasswordMutation] = useChangePartnerPasswordMutation();
  const [unlockPartnerLoginMutation] = useUnlockPartnerLoginMutation();

  // ===== Handlers ===== //
  const handleUnlockPartnerLogin = useCallback(async () => {
    try {
      await unlockPartnerLoginMutation({ variables: { uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.MESSAGE'),
      });

      refetch();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.MESSAGE'),
      });
    }
  }, [uuid]);

  const handleChangePassword = useCallback(async ({ newPassword }: {newPassword: string}) => {
    try {
      await changePartnerPasswordMutation({ variables: { uuid, newPassword } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SET_NEW_PASSWORD.SUCCESS.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SET_NEW_PASSWORD.SUCCESS.MESSAGE'),
      });

      changePasswordModal.hide();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SET_NEW_PASSWORD.ERROR.TITLE'),
        message: error.error === 'error.validation.password.repeated'
          ? I18n.t(error.error)
          : I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SET_NEW_PASSWORD.ERROR.MESSAGE'),
      });
    }
  }, [uuid]);

  const handleOpenChangePasswordModal = useCallback(() => {
    changePasswordModal.show({
      uuid,
      fullName: fullName || '',
      onSubmit: handleChangePassword,
    });
  }, [fullName, uuid]);

  return {
    allowChangePassword,
    isLock,
    handleUnlockPartnerLogin,
    handleOpenChangePasswordModal,
  };
};

export default usePartnerHeader;
