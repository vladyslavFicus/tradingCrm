import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { Partner } from '__generated__/types';
import { usePermission } from 'providers/PermissionsProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { isMaxLoginAttemptReached } from 'utils/profileLock';
import permissions from 'config/permissions';
import ChangePasswordModal from 'modals/ChangePasswordModal';
import { Button } from 'components/Buttons';
import Uuid from 'components/Uuid';
import { usePartnerLockStatusQuery } from './graphql/__generated__/PartnerLockStatusQuery';
import { useChangePartnerPasswordMutation } from './graphql/__generated__/ChangePartnerPasswordMutation';
import { useUnlockPartnerLoginMutation } from './graphql/__generated__/UnlockPartnerLoginMutation';
import './PartnerHeader.scss';

type Props = {
  partner: Partner,
  modals: {
    changePasswordModal: Modal,
  },
};

const PartnerHeader = (props: Props) => {
  const {
    partner: {
      fullName,
      country,
      uuid,
      status,
    },
    modals: {
      changePasswordModal,
    },
  } = props;

  const permission = usePermission();

  const allowChangePassword = permission.allows(permissions.PARTNERS.CHANGE_PASSWORD);

  // ===== Requests ===== //
  const { data, refetch } = usePartnerLockStatusQuery({ variables: { uuid }, fetchPolicy: 'network-only' });

  const locks = data?.loginLock;
  const isLock = !!locks && isMaxLoginAttemptReached(locks) && status !== 'CLOSED';

  const [changePartnerPasswordMutation] = useChangePartnerPasswordMutation();
  const [unlockPartnerLoginMutation] = useUnlockPartnerLoginMutation();

  // ===== Handlers ===== //
  const handleUnlockPartnerLogin = async () => {
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
  };

  const handleChangePassword = async ({ newPassword }: {newPassword: string}) => {
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
  };

  const handleOpenChangePasswordModal = () => {
    changePasswordModal.show({
      uuid,
      fullName,
      onSubmit: handleChangePassword,
    });
  };

  return (
    <div className="PartnerHeader">
      <div className="PartnerHeader__topic">
        <div className="PartnerHeader__title">{fullName}</div>

        <div className="PartnerHeader__uuid">
          <If condition={!!uuid}>
            <Uuid uuid={uuid} />
          </If>

          <If condition={!!country}>
            <span>- {country}</span>
          </If>
        </div>
      </div>

      <div className="PartnerHeader__actions">
        <If condition={isLock}>
          <Button
            className="PartnerHeader__action"
            onClick={handleUnlockPartnerLogin}
            primary
            small
          >
            {I18n.t('PARTNER_PROFILE.PROFILE.HEADER.UNLOCK')}
          </Button>
        </If>

        <If condition={allowChangePassword}>
          <Button
            className="PartnerHeader__action"
            onClick={handleOpenChangePasswordModal}
            secondary
            small
          >
            {I18n.t('PARTNER_PROFILE.CHANGE_PASSWORD')}
          </Button>
        </If>
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    changePasswordModal: ChangePasswordModal,
  }),
)(PartnerHeader);
