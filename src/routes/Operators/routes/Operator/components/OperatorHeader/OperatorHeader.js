import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withRequests, parseErrors } from 'apollo';
import { withModals } from 'hoc';
import { notify, LevelType } from 'providers/NotificationProvider';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { isMaxLoginAttemptReached } from 'utils/profileLock';
import { passwordPattern, passwordMaxSize, passwordCustomError } from 'constants/operators';
import ChangePasswordModal from 'modals/ChangePasswordModal';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/Buttons';
import Uuid from 'components/Uuid';
import OperatorLockStatusQuery from './graphql/OperatorLockStatusQuery';
import ChangeOperatorPasswordMutation from './graphql/ChangeOperatorPasswordMutation';
import ResetOperatorPasswordMutation from './graphql/ResetOperatorPasswordMutation';
import UnlockOperatorLoginMutation from './graphql/UnlockOperatorLoginMutation';
import './OperatorHeader.scss';

class OperatorHeader extends PureComponent {
  static propTypes = {
    operator: PropTypes.operator.isRequired,
    operatorLockStatus: PropTypes.query({
      loginLock: PropTypes.shape({
        isLocked: PropTypes.bool,
        lockReason: PropTypes.arrayOf(PropTypes.shape({
          lockReason: PropTypes.string,
        })),
      }),
    }).isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
      changePasswordModal: PropTypes.modalType,
    }).isRequired,
    unlockOperatorLogin: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
  };

  handleUnlockOperatorLogin = async () => {
    const {
      operator: { uuid },
      operatorLockStatus,
      unlockOperatorLogin,
    } = this.props;

    try {
      await unlockOperatorLogin({ variables: { uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.SUCCESS.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.SUCCESS.MESSAGE'),
      });

      operatorLockStatus.refetch();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.ERROR.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.UNLOCK.ERROR.MESSAGE'),
      });
    }
  };

  handleResetPassword = async () => {
    const {
      resetPassword,
      operator: { uuid },
      modals: { confirmActionModal },
    } = this.props;

    try {
      await resetPassword({
        variables: { uuid },
      });

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
  }

  handleOpenResetPasswordModal = () => {
    const {
      operator: { uuid, fullName },
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      onSubmit: this.handleResetPassword,
      modalTitle: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.TITLE'),
      actionText: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TEXT'),
      additionalText: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TARGET'),
      submitButtonLabel: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.CONFIRM_ACTION'),
      fullName,
      uuid,
    });
  };

  handleChangePassword = async ({ newPassword }) => {
    const {
      changePassword,
      operator: { uuid },
      modals: { changePasswordModal },
    } = this.props;

    try {
      await changePassword({ variables: { uuid, newPassword } });

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

  handleOpenChangePasswordModal = () => {
    const {
      operator: { uuid, fullName },
      modals: { changePasswordModal },
    } = this.props;

    changePasswordModal.show({
      uuid,
      fullName,
      passwordPattern,
      passwordMaxSize,
      passwordCustomError,
      onSubmit: this.handleChangePassword,
    });
  };

  render() {
    const {
      operator: {
        operatorStatus,
        fullName,
        country,
        uuid,
      },
      operatorLockStatus,
    } = this.props;

    const locks = operatorLockStatus.data?.loginLock;

    return (
      <div className="OperatorHeader">
        <div className="OperatorHeader__topic">
          <div className="OperatorHeader__title">{fullName}</div>
          <div className="OperatorHeader__uuid">
            <If condition={uuid}>
              <Uuid uuid={uuid} />
            </If>

            <If condition={country}>
              <span>- {country}</span>
            </If>
          </div>
        </div>

        <div className="OperatorHeader__actions">
          <If
            condition={isMaxLoginAttemptReached(locks) && operatorStatus !== 'CLOSED'}
          >
            <Button
              className="OperatorHeader__action"
              onClick={this.handleUnlockOperatorLogin}
              primary
              small
            >
              {I18n.t('OPERATOR_PROFILE.PROFILE.HEADER.UNLOCK')}
            </Button>
          </If>

          <If condition={operatorStatus === 'ACTIVE'}>
            <PermissionContent permissions={permissions.OPERATORS.RESET_PASSWORD}>
              <Button
                className="OperatorHeader__action"
                onClick={this.handleOpenResetPasswordModal}
                primary
                small
              >
                {I18n.t('OPERATOR_PROFILE.RESET_PASSWORD')}
              </Button>
            </PermissionContent>
          </If>

          <PermissionContent permissions={permissions.OPERATORS.CHANGE_PASSWORD}>
            <Button
              className="OperatorHeader__action"
              onClick={this.handleOpenChangePasswordModal}
              primary
              small
            >
              {I18n.t('OPERATOR_PROFILE.CHANGE_PASSWORD')}
            </Button>
          </PermissionContent>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withModals({
    changePasswordModal: ChangePasswordModal,
    confirmActionModal: ConfirmActionModal,
  }),
  withRequests({
    operatorLockStatus: OperatorLockStatusQuery,
    resetPassword: ResetOperatorPasswordMutation,
    changePassword: ChangeOperatorPasswordMutation,
    unlockOperatorLogin: UnlockOperatorLoginMutation,
  }),
)(OperatorHeader);
