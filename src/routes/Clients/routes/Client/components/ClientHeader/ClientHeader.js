import React, { PureComponent } from 'react';
import compose from 'compose-function';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { withRequests, parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import permissions from 'config/permissions';
import customTimeout from 'utils/customTimeout';
import { isMaxLoginAttemptReached } from 'utils/profileLock';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import ChangePasswordModal from 'modals/ChangePasswordModal';
import CreateClientCallbackModal from 'modals/CreateClientCallbackModal';
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
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
      changePasswordModal: PropTypes.modalType,
      createClientCallbackModal: PropTypes.modalType,
    }).isRequired,
  };

  state = {
    isRunningReloadAnimation: false,
  }

  onHandleReloadClick = () => {
    this.setState(
      { isRunningReloadAnimation: true },
      () => {
        customTimeout(() => {
          this.setState({ isRunningReloadAnimation: false });
        }, 1000);
      },
    );

    EventEmitter.emit(CLIENT_RELOAD);
  };

  handleUnlockClientLogin = async () => {
    const {
      unlockClientLogin,
      clientLockStatusQuery,
      client: { uuid },
    } = this.props;

    try {
      // # Unlock client's ability to login
      await unlockClientLogin({ variables: { playerUUID: uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.MESSAGE'),
      });

      clientLockStatusQuery.refetch();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
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
      resetPassword,
      client: { uuid },
      modals: { confirmActionModal },
    } = this.props;

    try {
      await resetPassword({ variables: { playerUUID: uuid } });

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
      changePassword,
      client: { uuid },
      modals: { changePasswordModal },
    } = this.props;

    try {
      await changePassword({ variables: { newPassword, clientUuid: uuid } });

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

  handleOpenAddCallbackModal = () => {
    const { modals: { createClientCallbackModal } } = this.props;
    createClientCallbackModal.show();
  };

  render() {
    const {
      client,
      clientLockStatusQuery,
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

    const locks = clientLockStatusQuery.data?.loginLock;
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

          <If condition={uuid}>
            <div className="ClientHeader__uuid">
              <Uuid uuid={uuid} uuidPrefix="PL" />
            </div>
          </If>
        </div>

        <div className="ClientHeader__actions">

          <PermissionContent permissions={permissions.USER_PROFILE.CREATE_CALLBACK}>
            <Button
              data-testid="addCallbackButton"
              small
              tertiary
              className="ClientHeader__action"
              onClick={this.handleOpenAddCallbackModal}
            >
              {I18n.t('CLIENT_PROFILE.CALLBACKS.ADD_CALLBACK')}
            </Button>
          </PermissionContent>

          <If condition={isMaxLoginAttemptReached(locks) && status?.type !== 'BLOCKED'}>
            <Button
              className="ClientHeader__action"
              onClick={this.handleUnlockClientLogin}
              tertiary
              small
            >
              {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.UNLOCK')}
            </Button>
          </If>

          <PermissionContent permissions={permissions.NOTES.ADD_NOTE}>
            <NotePopover
              playerUUID={uuid}
              targetUUID={uuid}
              targetType={targetTypes.PLAYER}
            >
              <Button
                data-testid="addNoteButton"
                className="ClientHeader__action"
                tertiary
                small
              >
                {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.ADD_NOTE')}
              </Button>
            </NotePopover>
          </PermissionContent>

          <Button
            data-testid="refreshButton"
            className="ClientHeader__action"
            onClick={this.onHandleReloadClick}
            tertiary
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
            classNameMenu="dropdown-over-sticky"
            items={[
              {
                label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.RESET_PASSWORD'),
                onClick: this.handleOpenResetPasswordModal,
                permission: permissions.USER_PROFILE.RESET_PASSWORD,
              },
              {
                label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
                onClick: this.handleOpenChangePasswordModal,
                permission: permissions.USER_PROFILE.CHANGE_PASSWORD,
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

export default compose(
  withModals({
    confirmActionModal: ConfirmActionModal,
    changePasswordModal: ChangePasswordModal,
    createClientCallbackModal: CreateClientCallbackModal,
  }),
  withRequests({
    clientLockStatusQuery: ClientLockStatusQuery,
    unlockClientLogin: ClientUnlockLoginMutation,
    changePassword: ClientChangePasswordMutation,
    resetPassword: ClientResetPasswordMutation,
  }),
)(ClientHeader);
