import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { Operator } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import permissions from 'config/permissions';
import { isMaxLoginAttemptReached } from 'utils/profileLock';
import { passwordPattern, passwordMaxSize, passwordCustomError } from 'constants/operators';
import ChangePasswordModal from 'modals/ChangePasswordModal';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { Button } from 'components/Buttons';
import Uuid from 'components/Uuid';
import { useOperatorLockStatusQuery } from './graphql/__generated__/OperatorLockStatusQuery';
import { useChangeOperatorPasswordMutation } from './graphql/__generated__/ChangeOperatorPasswordMutation';
import { useResetOperatorPasswordMutation } from './graphql/__generated__/ResetOperatorPasswordMutation';
import { useUnlockOperatorLoginMutation } from './graphql/__generated__/UnlockOperatorLoginMutation';
import './OperatorHeader.scss';

type Props = {
  operator: Operator,
  modals: {
    changePasswordModal: Modal,
  },
};

const OperatorHeader = (props: Props) => {
  const {
    operator: {
      operatorStatus,
      fullName,
      country,
      uuid,
    },
    modals: {
      changePasswordModal,
    },
  } = props;

  const permission = usePermission();

  const allowResetPassword = permission.allows(permissions.OPERATORS.RESET_PASSWORD);
  const allowChangePassword = permission.allows(permissions.OPERATORS.CHANGE_PASSWORD);

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  // ===== Requests ===== //
  const operatorLockStatusQuery = useOperatorLockStatusQuery({ variables: { uuid }, fetchPolicy: 'network-only' });

  const locks = operatorLockStatusQuery.data?.loginLock;
  const isLock = !!locks && isMaxLoginAttemptReached(locks) && operatorStatus !== 'CLOSED';

  const [changeOperatorPasswordMutation] = useChangeOperatorPasswordMutation();
  const [resetOperatorPasswordMutation] = useResetOperatorPasswordMutation();
  const [unlockOperatorLoginMutation] = useUnlockOperatorLoginMutation();

  // ===== Handlers ===== //
  const handleUnlockOperatorLogin = async () => {
    try {
      await unlockOperatorLoginMutation({ variables: { uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.SUCCESS.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.SUCCESS.MESSAGE'),
      });

      operatorLockStatusQuery.refetch();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.ERROR.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.ERROR.MESSAGE'),
      });
    }
  };

  const handleResetPassword = async () => {
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
  };

  const handleOpenResetPasswordModal = () => {
    confirmActionModal.show({
      onSubmit: handleResetPassword,
      modalTitle: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.TITLE'),
      actionText: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TEXT'),
      additionalText: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TARGET'),
      submitButtonLabel: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.CONFIRM_ACTION'),
      fullName: fullName as string,
      uuid,
    });
  };

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

  const handleOpenChangePasswordModal = () => {
    changePasswordModal.show({
      uuid,
      fullName,
      passwordPattern,
      passwordMaxSize,
      passwordCustomError,
      onSubmit: handleChangePassword,
    });
  };

  return (
    <div className="OperatorHeader">
      <div className="OperatorHeader__topic">
        <div className="OperatorHeader__title">{fullName}</div>

        <div className="OperatorHeader__uuid">
          <If condition={!!uuid}>
            <Uuid uuid={uuid} />
          </If>

          <If condition={!!country}>
            <span>- {country}</span>
          </If>
        </div>
      </div>

      <div className="OperatorHeader__actions">
        <If condition={isLock}>
          <Button
            className="OperatorHeader__action"
            data-testid="OperatorHeader-unlockButton"
            onClick={handleUnlockOperatorLogin}
            primary
            small
          >
            {I18n.t('OPERATOR_PROFILE.PROFILE.HEADER.UNLOCK')}
          </Button>
        </If>

        <If condition={allowResetPassword && operatorStatus === 'ACTIVE'}>
          <Button
            className="OperatorHeader__action"
            data-testid="OperatorHeader-resetPasswordButton"
            onClick={handleOpenResetPasswordModal}
            primary
            small
          >
            {I18n.t('OPERATOR_PROFILE.RESET_PASSWORD')}
          </Button>
        </If>

        <If condition={allowChangePassword}>
          <Button
            className="OperatorHeader__action"
            data-testid="OperatorHeader-changePasswordButton"
            onClick={handleOpenChangePasswordModal}
            primary
            small
          >
            {I18n.t('OPERATOR_PROFILE.CHANGE_PASSWORD')}
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
)(OperatorHeader);
