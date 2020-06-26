import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withNotifications, withModals } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import { lastActivityStatusesLabels, lastActivityStatusesColors } from 'constants/lastActivity';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import ActionsDropDown from 'components/ActionsDropDown';
import NotePopover from 'components/NotePopover';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import ProfileLastLogin from 'components/ProfileLastLogin';
import Uuid from 'components/Uuid';
import PermissionContent from 'components/PermissionContent';
import StickyWrapper from 'components/StickyWrapper';
import GridStatus from 'components/GridStatus';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import ChangePasswordModal from 'modals/ChangePasswordModal';
import { Button } from 'components/UI';
import customTimeout from 'utils/customTimeout';
import EventEmitter, { PROFILE_RELOAD } from 'utils/EventEmitter';
import PlayerStatus from '../PlayerStatus';
import Balances from '../Balances';
import HeaderPlayerPlaceholder from '../HeaderPlayerPlaceholder';
import LoginLockQuery from './graphql/LoginLockQuery';
import PasswordResetRequestMutation from './graphql/PasswordResetRequestMutation';
import ChangePasswordMutation from './graphql/ChangePasswordMutation';
import UnlockLoginMutation from './graphql/UnlockLoginMutation';
import './ProfileHeader.scss';

const changePasswordPermission = new Permissions([permissions.USER_PROFILE.CHANGE_PASSWORD]);
const resetPasswordPermission = new Permissions([permissions.USER_PROFILE.RESET_PASSWORD]);

class ProfileHeader extends Component {
  static propTypes = {
    newProfile: PropTypes.newProfile,
    availableStatuses: PropTypes.array,
    loaded: PropTypes.bool,
    loginLock: PropTypes.query(
      PropTypes.shape({
        lock: PropTypes.bool,
      }),
    ).isRequired,
    permission: PropTypes.permission.isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
      changePasswordModal: PropTypes.modalType,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    passwordResetRequest: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    unlockLogin: PropTypes.func.isRequired,
  };

  static defaultProps = {
    newProfile: {},
    availableStatuses: [],
    loaded: false,
  };

  state = {
    isRunningReloadAnimation: false,
  }

  componentDidUpdate() {
    const { isRunningReloadAnimation } = this.state;

    if (isRunningReloadAnimation) {
      customTimeout(() => {
        this.setState({ isRunningReloadAnimation: false });
      }, 1000);
    }
  }

  onHandleReloadClick = () => {
    this.setState({ isRunningReloadAnimation: true });

    EventEmitter.emit(PROFILE_RELOAD);
  };

  handleResetPasswordClick = () => {
    const {
      newProfile: {
        uuid,
        firstName,
        lastName,
      },
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      uuid,
      onSubmit: this.handleResetPassword,
      modalTitle: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TITLE'),
      actionText: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TEXT'),
      fullName: `${firstName} ${lastName}`,
      submitButtonLabel: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.BUTTON_ACTION'),
    });
  };

  handleResetPassword = async () => {
    const {
      notify,
      passwordResetRequest,
      modals: { confirmActionModal },
      newProfile: { uuid },
    } = this.props;

    const response = await passwordResetRequest({ variables: { playerUUID: uuid } });
    const success = get(response, 'data.profile.passwordResetRequest.success');

    if (success) {
      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.NOTIFICATION_TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.SUCCESS_NOTIFICATION_TEXT'),
      });

      confirmActionModal.hide();
    } else {
      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.NOTIFICATION_TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.ERROR_NOTIFICATION_TEXT'),
      });
    }
  };

  handleChangePasswordClick = () => {
    const {
      newProfile: {
        uuid,
        firstName,
        lastName,
      },
      modals: { changePasswordModal },
    } = this.props;

    changePasswordModal.show({
      fullName: `${firstName} ${lastName}`,
      uuid,
      onSubmit: this.handleChangePassword,
    });
  };

  handleChangePassword = async ({ newPassword }) => {
    const {
      notify,
      changePassword,
      newProfile: { uuid },
      modals: { changePasswordModal },
    } = this.props;

    const response = await changePassword({ variables: { newPassword, playerUUID: uuid } });
    const success = get(response, 'data.profile.changePassword.success');

    notify({
      level: !success ? 'error' : 'success',
      title: !success
        ? I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.TITLE')
        : I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.TITLE'),
      message: !success
        ? I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.MESSAGE')
        : I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.MESSAGE'),
    });

    if (success) {
      changePasswordModal.hide();
    }
  };

  handleUnlockLogin = async () => {
    const {
      notify,
      unlockLogin,
      loginLock,
      newProfile: { uuid },
    } = this.props;
    const response = await unlockLogin({ variables: { playerUUID: uuid } });
    const success = get(response, 'data.auth.unlockLogin.success');

    if (success) {
      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.MESSAGE'),
      });

      loginLock.refetch();
    } else {
      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.TITLE'),
        message: I18n.t('PLAYER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.MESSAGE'),
      });
    }
  };

  render() {
    const {
      availableStatuses,
      loaded,
      loginLock,
      permission: {
        permissions: currentPermissions,
      },
      newProfile: {
        age,
        firstName,
        lastName,
        uuid,
        registrationDetails: {
          registrationDate,
        },
        profileVerified,
        status: {
          changedAt,
          changedBy,
          comment,
          reason,
          type: statusType,
        },
        profileView: {
          balance: {
            amount,
            credit,
          },
          lastSignInSessions,
          lastActivity,
        },
        tradingAccount,
      },
    } = this.props;

    const { isRunningReloadAnimation } = this.state;
    const lock = get(loginLock, 'data.loginLock.lock');
    const lastActivityDate = get(lastActivity, 'date');
    const lastActivityDateLocal = lastActivityDate && moment.utc(lastActivityDate).local();
    const lastActivityType = lastActivityDateLocal
      && moment().diff(lastActivityDateLocal, 'minutes') < 5 ? 'ONLINE' : 'OFFLINE';

    const fullName = [firstName, lastName].filter(i => i).join(' ');

    return (
      <div className="ProfileHeader">
        <StickyWrapper top={48} innerZ={3} activeClass="heading-fixed">
          <div className="panel-heading-row">
            <HeaderPlayerPlaceholder ready={loaded}>
              <div className="panel-heading-row__info">
                <div className="panel-heading-row__info-title">
                  {fullName || I18n.t('PLAYER_PROFILE.PROFILE.HEADER.NO_FULLNAME')}
                  {' '}
                  ({age || '?'})
                  {' '}
                  {profileVerified && <i className="fa fa-check text-success" />}
                </div>
                <div className="panel-heading-row__info-ids">
                  {
                    uuid
                    && (
                      <Uuid
                        uuid={uuid}
                        uuidPrefix={uuid.indexOf('PLAYER') === -1 ? 'PL' : null}
                      />
                    )
                  }
                </div>
              </div>
            </HeaderPlayerPlaceholder>
            <div className="panel-heading-row__actions">
              <If condition={lock && statusType !== 'BLOCKED'}>
                <button
                  onClick={this.handleUnlockLogin}
                  type="button"
                  className="btn btn-sm mx-3 btn-primary"
                >
                  {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.UNLOCK')}
                </button>
              </If>
              <PermissionContent permissions={permissions.NOTES.ADD_NOTE}>
                <NotePopover
                  playerUUID={uuid}
                  targetUUID={uuid}
                  targetType={targetTypes.PLAYER}
                >
                  <Button small commonOutline>
                    {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.ADD_NOTE')}
                  </Button>
                </NotePopover>
              </PermissionContent>
              <Button
                small
                commonOutline
                className="mx-3"
                onClick={this.onHandleReloadClick}
              >
                <i
                  className={classNames(
                    'fa fa-refresh', { 'fa-spin': isRunningReloadAnimation },
                  )}
                />
              </Button>
              <ActionsDropDown
                items={[
                  {
                    id: 'reset-password-option',
                    label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.RESET_PASSWORD'),
                    onClick: this.handleResetPasswordClick,
                    visible: resetPasswordPermission.check(currentPermissions),
                  },
                  {
                    label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
                    onClick: this.handleChangePasswordClick,
                    visible: changePasswordPermission.check(currentPermissions),
                  },
                ]}
              />
            </div>
          </div>
        </StickyWrapper>

        <div className="layout-quick-overview">
          <div className="header-block header-block_account">
            <PlayerStatus
              playerUUID={uuid}
              statusDate={changedAt}
              statusAuthor={changedBy}
              profileStatusComment={comment}
              status={statusType}
              reason={reason}
              onChange={this.handleStatusChange}
              availableStatuses={availableStatuses}
              refetchLoginLock={loginLock.refetch}
            />
          </div>
          <div className="header-block header-block-inner header-block_balance" id="player-profile-balance-block">
            <If condition={uuid}>
              <Balances
                clientRegistrationDate={registrationDate}
                balances={{
                  amount,
                  credit,
                }}
                tradingAccounts={tradingAccount && tradingAccount.filter(account => account.accountType !== 'DEMO')}
                uuid={uuid}
              />
            </If>
          </div>
          <ProfileLastLogin lastIp={lastSignInSessions ? lastSignInSessions[lastSignInSessions.length - 1] : null} />
          <div className="header-block header-block-inner">
            <div className="header-block-title">{I18n.t('PROFILE.LAST_ACTIVITY.TITLE')}</div>
            <GridStatus
              colorClassName={lastActivityStatusesColors[lastActivityType]}
              statusLabel={I18n.t(lastActivityStatusesLabels[lastActivityType])}
              info={lastActivityDateLocal}
              infoLabel={date => date.fromNow()}
            />
            {lastActivityDateLocal && (
              <div className="header-block-small">
                {I18n.t('COMMON.ON')} {lastActivityDateLocal.format('DD.MM.YYYY')}
              </div>
            )}
          </div>
          <div className="header-block header-block-inner">
            <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.REGISTERED.TITLE')}</div>
            <div className="header-block-middle">
              {moment.utc(registrationDate).local().fromNow()}
            </div>
            <div className="header-block-small">
              {I18n.t('COMMON.ON')} {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
            </div>
          </div>
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
    loginLock: LoginLockQuery,
    passwordResetRequest: PasswordResetRequestMutation,
    changePassword: ChangePasswordMutation,
    unlockLogin: UnlockLoginMutation,
  }),
)(ProfileHeader);
