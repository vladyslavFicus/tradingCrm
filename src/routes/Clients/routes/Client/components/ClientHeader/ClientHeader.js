/* eslint-disable */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { withNotifications, withModals } from 'hoc';
import { withRequests, parseErrors } from 'apollo';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import customTimeout from 'utils/customTimeout';
import { withPermission } from 'providers/PermissionsProvider';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import ChangePasswordModal from 'modals/ChangePasswordModal';
import PermissionContent from 'components/PermissionContent';
import ActionsDropDown from 'components/ActionsDropDown';
import NotePopover from 'components/NotePopover';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import ClientLockStatusQuery from './graphql/ClientLockStatusQuery';
import ClientUnlockLoginMutation from './graphql/ClientUnlockLoginMutation';
import ClientResetPasswordMutation from './graphql/ClientResetPasswordMutation';
import ClientChangePasswordMutation from './graphql/ClientChangePasswordMutation';
import './ClientHeader.scss';


class ClientHeader extends PureComponent {
  static propTypes = {
    client: PropTypes.profile.isRequired,
    clientLockStatusQuery: PropTypes.query({
      loginLock: PropTypes.shape({
        lock: PropTypes.bool,
      }),
    }).isRequired,
    changePassword: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    unlockClientLogin: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
    notify: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
      changePasswordModal: PropTypes.modalType,
    }).isRequired,
  };

  state = {
    isRunningReloadAnimation: false,
  }

  // componentDidUpdate() {
  //   const { isRunningReloadAnimation } = this.state;

  //   if (isRunningReloadAnimation) {
  //     customTimeout(() => {
  //       this.setState({ isRunningReloadAnimation: false });
  //     }, 1000);
  //   }
  // }


  // # Check this out
  onHandleReloadClick = () => {
    this.setState(
      { isRunningReloadAnimation: true },
      () => {
        customTimeout(() => {
          this.setState({ isRunningReloadAnimation: false });
        }, 1000);
      }
    );

    EventEmitter.emit(CLIENT_RELOAD);
  };

  handleUnlockClientLogin = async () => {
    const {
      notify,
      unlockClientLogin,
      clientLockStatusQuery,
      client: { uuid },
    } = this.props;

    try {
      // # Unlock client's ability to login
      await unlockClientLogin({ variables: { playerUUID: uuid } });

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.MESSAGE'),
      });

      clientLockStatusQuery.refetch();
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.MESSAGE'),
      });
    }
  };

  handleOpenResetPasswordModal = () => {
    const {
      client: {
        uuid,
        lastName,
        firstName,
      },
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      uuid,
      onSubmit: this.handleResetPassword,
      fullName: `${firstName} ${lastName}`,
      modalTitle: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TITLE'),
      actionText: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TEXT'),
      submitButtonLabel: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.BUTTON_ACTION'),
    });
  };

  handleResetPassword = async () => {
    const {
      notify,
      resetPassword,
      client: { uuid },
      modals: { confirmActionModal },
    } = this.props;

    try {
      await resetPassword({ variables: { playerUUID: uuid } });

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.NOTIFICATION_TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.SUCCESS_NOTIFICATION_TEXT'),
      });

      confirmActionModal.hide();
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.NOTIFICATION_TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.ERROR_NOTIFICATION_TEXT'),
      });
    }
  };

  handleOpenChangePasswordModal = () => {
    const {
      client: {
        uuid,
        lastName,
        firstName,
      },
      modals: { changePasswordModal },
    } = this.props;

    changePasswordModal.show({
      uuid,
      fullName: `${firstName} ${lastName}`,
      onSubmit: this.handleChangePassword,
    });
  };

  handleChangePassword = async ({ newPassword }) => {
    const {
      notify,
      changePassword,
      client: { uuid },
      modals: { changePasswordModal },
    } = this.props;

    try {
      await changePassword({ variables: { newPassword, clientUuid: uuid } });

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.MESSAGE'),
      });

      changePasswordModal.hide();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.TITLE'),
        message: I18n.t(
          error.error,
          { defaultValue: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.MESSAGE') },
        ),
      });
    }
  };

  render() {
    const {
      client,
      clientLockStatusQuery,
      permission: { permissions: currentPermissions },
    } = this.props;

    const { isRunningReloadAnimation } = this.state;

    const {
      age,
      uuid,
      status,
      lastName,
      firstName,
      profileVerified,
    } = client || {};

    const changePasswordPermission = new Permissions([permissions.USER_PROFILE.CHANGE_PASSWORD]);
    const resetPasswordPermission = new Permissions([permissions.USER_PROFILE.RESET_PASSWORD]);

    const clientLoginLocked = clientLockStatusQuery.data?.loginLock?.lock || false;

    return (
      <div className="ClientHeader">
        <div className="ClientHeader__topic">
          <div className="ClientHeader__title">
            <span>{`${firstName} ${lastName}`}</span>
            <span>{` (${age || '?' }) `}</span>

            <If condition={profileVerified}>
              <i className="fa fa-check ClientHeader__title-verified" />
            </If>
          </div>

          <If condition={uuid}>
            <div className="ClientHeader__uuid">
              <Uuid uuid={uuid} uuidPrefix="PL" />
            </div>
          </If>
        </div>

        <div className="ClientHeader__actions">
          <If condition={clientLoginLocked && status?.type !== 'BLOCKED'}>
            <Button
              className="ClientHeader__action"
              onClick={this.handleUnlockClientLogin}
              commonOutline
              small
            >
              {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.UNLOCK')}
            </Button>
          </If>

          <PermissionContent permissions={permissions.NOTES.ADD_NOTE}>
            <NotePopover
              playerUUID={uuid}
              targetUUID={uuid}
              targetType={'PLAYER'}
            >
              <Button
                className="ClientHeader__action"
                commonOutline
                small
              >
                {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.ADD_NOTE')}
              </Button>
            </NotePopover>
          </PermissionContent>

          <Button
            className="ClientHeader__action"
            onClick={this.onHandleReloadClick}
            commonOutline
            small
          >
            <i
              className={classNames('fa fa-refresh ClientHeader__icon', {
                'ClientHeader__icon--spin': isRunningReloadAnimation,
              })}
            />
          </Button>

          <ActionsDropDown
            className="ClientHeader__action"
            items={[
              {
                label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.RESET_PASSWORD'),
                onClick: this.handleOpenResetPasswordModal,
                visible: resetPasswordPermission.check(currentPermissions),
              },
              {
                label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
                onClick: this.handleOpenChangePasswordModal,
                visible: changePasswordPermission.check(currentPermissions),
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withPermission,
  withModals({
    confirmActionModal: ConfirmActionModal,
    changePasswordModal: ChangePasswordModal,
  }),
  withRequests({
    clientLockStatusQuery: ClientLockStatusQuery,
    unlockClientLogin: ClientUnlockLoginMutation,
    changePassword: ClientChangePasswordMutation,
    resetPassword: ClientResetPasswordMutation,
  }),
)(ClientHeader);
