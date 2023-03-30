import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { parseErrors } from 'apollo';
import { LevelType, Modal, Notify } from 'types';
import { withModals, withNotifications } from 'hoc';
import { passwordMaxSize, passwordPattern } from 'routes/TE/constants';
import permissions from 'config/permissions';
import { useModal } from 'providers/ModalProvider';
import EventEmitter, { OPERATOR_RELOAD } from 'utils/EventEmitter';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/Buttons';
import Uuid from 'components/Uuid';
import { LoginLock } from '__generated__/types';
import { isMaxLoginAttemptReached } from 'utils/profileLock';
import ChangePasswordModal from 'modals/ChangePasswordModal';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { Operator } from '../../DealingOperator';
import { useChangeOperatorPasswordMutation } from './graphql/__generated__/ChangeOperatorPasswordMutation';
import { useResetOperatorPasswordMutation } from './graphql/__generated__/ResetOperatorPasswordMutation';
import { useUnlockOperatorLoginMutation } from './graphql/__generated__/UnlockOperatorLoginMutation';
import { useOperatorLockStatus } from './graphql/__generated__/OperatorLockStatusQuery';
import './DealingOperatorHeader.scss';

type Props = {
  operator: Operator,
  notify: Notify,
  modals: {
    changePasswordModal: Modal,
  },
};

const DealingOperatorHeader = (props: Props) => {
  const { operator, notify, modals: { changePasswordModal } } = props;
  const { status, firstName, lastName, uuid } = operator;
  const [changePasswordMutation] = useChangeOperatorPasswordMutation();
  const [resetPasswordMutation] = useResetOperatorPasswordMutation();
  const [unlockOperatorLoginMutation] = useUnlockOperatorLoginMutation();
  const operatorLockStatusQuery = useOperatorLockStatus({ variables: { uuid: operator.uuid } });
  const locks = operatorLockStatusQuery.data?.loginLock as LoginLock;

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const handleChangePassword = async ({ newPassword }: any) => {
    try {
      await changePasswordMutation({ variables: { uuid, newPassword } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_PASSWORD.SUCCESS.TITLE'),
        message: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_PASSWORD.SUCCESS.MESSAGE'),
      });

      changePasswordModal.hide();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_PASSWORD.ERROR.TITLE'),
        message: I18n.t(
          error.error,
          { defaultValue: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_PASSWORD.ERROR.MESSAGE') },
        ),
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPasswordMutation({ variables: { uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.RESET_PASSWORD.SUCCESS.TITLE'),
        message: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.RESET_PASSWORD.SUCCESS.MESSAGE'),
      });

      confirmActionModal.hide();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.RESET_PASSWORD.ERROR.TITLE'),
        message: I18n.t(
          error.error,
          { defaultValue: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.RESET_PASSWORD.ERROR.MESSAGE') },
        ),
      });
    }
  };

  const handleUnlockOperatorLogin = async () => {
    try {
      await unlockOperatorLoginMutation({ variables: { uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.SUCCESS.TITLE'),
        message: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.SUCCESS.MESSAGE'),
      });

      operatorLockStatusQuery.refetch();
      EventEmitter.emit(OPERATOR_RELOAD);
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.ERROR.TITLE'),
        message: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.ERROR.MESSAGE'),
      });
    }
  };

  const handleResetAction = () => confirmActionModal.show({
    uuid,
    onSubmit: handleResetPassword,
    fullName: `${firstName} ${lastName}`,
    modalTitle: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TITLE'),
    actionText: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TEXT'),
    submitButtonLabel: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.BUTTON_ACTION'),
  });

  const handleChangedAction = () => changePasswordModal.show({
    uuid,
    fullName: `${firstName} ${lastName}`,
    passwordPattern,
    passwordMaxSize,
    passwordCustomError: I18n.t('COMMON.OPERATOR_PASSWORD_INVALID'),
    onSubmit: handleChangePassword,
  });

  return (
    <div className="DealingOperatorHeader">
      <div className="DealingOperatorHeader__topic">
        <div className="DealingOperatorHeader__title">{`${firstName} ${lastName}`}</div>
        <div className="DealingOperatorHeader__uuid">
          <Uuid uuid={uuid} />
        </div>
      </div>

      <div className="DealingOperatorHeader__actions">
        <PermissionContent permissions={permissions.WE_TRADING.OPERATORS_UNLOCK}>
          <If condition={isMaxLoginAttemptReached(locks) && status !== 'CLOSED'}>
            <Button
              className="DealingOperatorHeader__action"
              onClick={handleUnlockOperatorLogin}
              primary
              small
            >
              {I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.UNLOCK')}
            </Button>
          </If>
        </PermissionContent>

        <If condition={status === 'ACTIVE'}>
          <PermissionContent permissions={permissions.WE_TRADING.OPERATORS_RESET_PASSWORD}>
            <Button
              className="DealingOperatorHeader__action"
              onClick={handleResetAction}
              primary
              small
            >
              {I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.RESET_PASSWORD')}
            </Button>
          </PermissionContent>
        </If>

        <PermissionContent permissions={permissions.WE_TRADING.OPERATORS_CHANGE_PASSWORD}>
          <Button
            className="DealingOperatorHeader__action"
            onClick={handleChangedAction}
            primary
            small
          >
            {I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.CHANGE_PASSWORD')}
          </Button>
        </PermissionContent>
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withNotifications,
  withModals({
    changePasswordModal: ChangePasswordModal,
  }),
)(DealingOperatorHeader);
