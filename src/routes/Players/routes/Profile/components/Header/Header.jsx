import React, { Component, Fragment } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import PlayerStatus from '../PlayerStatus';
import ActionsDropDown from '../../../../../../components/ActionsDropDown';
import Balances from '../Balances';
import Amount from '../../../../../../components/Amount';
import PopoverButton from '../../../../../../components/PopoverButton';
import permissions from '../../../../../../config/permissions';
import Permissions, { CONDITIONS } from '../../../../../../utils/permissions';
import PlayerLimits from '../PlayerLimits';
import ProfileLastLogin from '../../../../../../components/ProfileLastLogin';
import Uuid from '../../../../../../components/Uuid';
import HeaderPlayerPlaceholder from '../HeaderPlayerPlaceholder';
import { statuses } from '../../../../../../constants/user';
import { services } from '../../../../../../constants/services';
import PermissionContent from '../../../../../../components/PermissionContent';
import { withServiceCheck } from '../../../../../../components/HighOrder';
import ActivePlan from '../ActivePlan';
import StickyWrapper from '../../../../../../components/StickyWrapper';
import TemporaryUntil from '../TemporaryUntil';

const sendActivationLinkPermission = new Permissions([permissions.USER_PROFILE.SEND_ACTIVATION_LINK]);
const playerLimitsPermission = [
  permissions.USER_PROFILE.GET_LOGIN_LOCK,
  permissions.USER_PROFILE.GET_PAYMENT_LOCKS,
];
const changePasswordActionPermission = new Permissions([permissions.USER_PROFILE.CHANGE_PASSWORD]);

class Header extends Component {
  static propTypes = {
    playerProfile: PropTypes.shape({
      address: PropTypes.string,
      affiliateId: PropTypes.string,
      birthDate: PropTypes.string,
      btag: PropTypes.string,
      city: PropTypes.string,
      completed: PropTypes.bool,
      country: PropTypes.string,
      email: PropTypes.string,
      firstName: PropTypes.string,
      gender: PropTypes.string,
      profileVerified: PropTypes.bool,
      languageCode: PropTypes.string,
      lastName: PropTypes.string,
      marketingMail: PropTypes.bool,
      marketingSMS: PropTypes.bool,
      tailorMadeEmail: PropTypes.bool,
      tailorMadeSMS: PropTypes.bool,
      phoneNumber: PropTypes.string,
      phoneNumberVerified: PropTypes.bool,
      postCode: PropTypes.string,
      login: PropTypes.string,
      username: PropTypes.string,
      playerUUID: PropTypes.string,
      signInIps: PropTypes.arrayOf(PropTypes.ipEntity),
      profileStatusComment: PropTypes.string,
      accumulatedDeposits: PropTypes.price,
      accumulatedWithdrawals: PropTypes.price,
      temporaryUntil: PropTypes.string,
    }),
    onRefreshClick: PropTypes.func.isRequired,
    isLoadingProfile: PropTypes.bool.isRequired,
    lastIp: PropTypes.ipEntity,
    availableStatuses: PropTypes.array,
    onAddNoteClick: PropTypes.func.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    onResetPasswordClick: PropTypes.func.isRequired,
    onProfileActivateClick: PropTypes.func.isRequired,
    onPlayerLimitChange: PropTypes.func.isRequired,
    playerLimits: PropTypes.shape({
      state: PropTypes.shape({
        entities: PropTypes.arrayOf(PropTypes.playerLimitEntity).isRequired,
        deposit: PropTypes.shape({
          locked: PropTypes.bool.isRequired,
          canUnlock: PropTypes.bool.isRequired,
        }).isRequired,
        withdraw: PropTypes.shape({
          locked: PropTypes.bool.isRequired,
          canUnlock: PropTypes.bool.isRequired,
        }).isRequired,
        login: PropTypes.shape({
          lock: PropTypes.bool.isRequired,
          lockExpirationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
          lockReason: PropTypes.string,
        }).isRequired,
        error: PropTypes.object,
        isLoading: PropTypes.bool.isRequired,
        receivedAt: PropTypes.number,
      }).isRequired,
      unlockLogin: PropTypes.func.isRequired,
    }).isRequired,
    locale: PropTypes.string.isRequired,
    loaded: PropTypes.bool,
    onChangePasswordClick: PropTypes.func.isRequired,
    onShareProfileClick: PropTypes.func.isRequired,
    profileStatusDate: PropTypes.string,
    profileStatusAuthor: PropTypes.string,
    checkService: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lastIp: null,
    playerProfile: {},
    availableStatuses: [],
    loaded: false,
    profileStatusDate: null,
    profileStatusAuthor: null,
  };

  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  getRealWithBonusBalance = () => {
    const { playerProfile: { bonusBalance, playerUUID, realMoneyBalance } } = this.props;

    if (!playerUUID) {
      return null;
    }

    return (
      <div className="header-block-small">
        RM <Amount {...realMoneyBalance} /> + BM <Amount {...bonusBalance} />
      </div>
    );
  };

  handleStatusChange = (data) => {
    const { playerProfile, onStatusChange } = this.props;

    if (playerProfile && playerProfile.playerUUID) {
      onStatusChange({ ...data, playerUUID: playerProfile.playerUUID });
    } else {
      throw new SubmissionError({ _error: 'User uuid not found.' });
    }
  };

  render() {
    const {
      locks,
      playerProfile: {
        age,
        firstName,
        username,
        languageCode,
        lastName,
        accumulatedDeposits,
        accumulatedWithdrawals,
        withdrawableAmount,
        profileStatusAuthor,
        profileStatusDate,
        profileStatusReason,
        profileStatusComment,
        suspendEndDate,
        profileStatus,
        profileVerified,
        totalBalance,
        playerUUID,
        registrationDate,
        temporaryUntil,
      },
      playerProfile,
      availableStatuses,
      onAddNoteClick,
      onResetPasswordClick,
      onProfileActivateClick,
      onPlayerLimitChange,
      playerLimits,
      lastIp,
      onRefreshClick,
      isLoadingProfile,
      locale,
      loaded,
      onChangePasswordClick,
      onShareProfileClick,
      checkService,
    } = this.props;

    const { permissions: currentPermissions } = this.context;
    const fullName = [firstName, lastName].filter(i => i).join(' ');

    return (
      <Fragment>
        <StickyWrapper top={0} innerZ={3} activeClass="heading-fixed">
          <If condition={temporaryUntil}>
            <TemporaryUntil temporaryUntil={temporaryUntil} />
          </If>
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
                  {username}
                  {' - '}
                  {
                    playerUUID &&
                    <Uuid
                      uuid={playerUUID}
                      uuidPrefix={playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
                    />
                  }
                  {' - '}
                  {languageCode}
                </div>
              </div>
            </HeaderPlayerPlaceholder>
            <div className="panel-heading-row__actions">
              <PermissionContent permissions={permissions.NOTES.ADD_NOTE}>
                <PopoverButton
                  id="header-add-note-button"
                  className="btn btn-sm btn-default-outline"
                  onClick={onAddNoteClick}
                >
                  {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.ADD_NOTE')}
                </PopoverButton>
              </PermissionContent>
              <button
                className="btn btn-sm btn-default-outline mx-3"
                onClick={onRefreshClick}
                id="refresh-page-button"
              >
                <i className={classNames('fa fa-refresh', { 'fa-spin': isLoadingProfile })} />
              </button>
              <If condition={!isLoadingProfile}>
                <ActionsDropDown
                  items={[
                    {
                      id: 'reset-password-option',
                      label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.RESET_PASSWORD'),
                      onClick: onResetPasswordClick,
                    },
                    {
                      label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.SEND_ACTIVATION_LINK'),
                      onClick: onProfileActivateClick,
                      visible: (
                        sendActivationLinkPermission.check(currentPermissions)
                        && profileStatus === statuses.INACTIVE
                      ),
                    },
                    {
                      label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
                      onClick: onChangePasswordClick,
                      visible: changePasswordActionPermission.check(currentPermissions),
                    },
                    {
                      label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.SHARE_PROFILE'),
                      onClick: onShareProfileClick,
                    },
                  ]}
                />
              </If>
            </div>
          </div>
        </StickyWrapper>

        <div className="layout-quick-overview">
          <div className="header-block header-block_account">
            <PlayerStatus
              locale={locale}
              statusDate={profileStatusDate}
              statusAuthor={profileStatusAuthor}
              profileStatusComment={profileStatusComment}
              endDate={suspendEndDate}
              status={profileStatus}
              reason={profileStatusReason}
              onChange={this.handleStatusChange}
              availableStatuses={availableStatuses}
              profileName={fullName}
              profileUuid={playerUUID}
            />
          </div>
          <div className="header-block header-block_balance" id="player-profile-balance-block">
            <If condition={playerUUID}>
              <Balances
                label={
                  <div className="dropdown-tab">
                    <div className="header-block-title">Balance</div>
                    <div className="header-block-middle">
                      <Amount {...totalBalance} amountId="player-total-balance-amount" />
                    </div>
                    {this.getRealWithBonusBalance()}
                  </div>
                }
                accumulatedBalances={{ withdrawableAmount, accumulatedDeposits, accumulatedWithdrawals }}
              />
            </If>
          </div>
          <PermissionContent permissions={playerLimitsPermission} permissionsCondition={CONDITIONS.OR}>
            <div className="header-block header-block_player-limits">
              <PlayerLimits
                profile={playerProfile}
                locks={locks}
                limits={playerLimits.state}
                unlockLogin={playerLimits.unlockLogin}
                onChange={onPlayerLimitChange}
              />
            </div>
          </PermissionContent>
          <ProfileLastLogin lastIp={lastIp} />
          <div className="header-block">
            <div className="header-block-title">Registered</div>
            <div className="header-block-middle">
              {moment.utc(registrationDate).local().fromNow()}
            </div>
            <div className="header-block-small">
              on {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
            </div>
          </div>
          <If condition={checkService(services.dwh)}>
            <ActivePlan playerUUID={playerUUID} />
          </If>
        </div>
      </Fragment>
    );
  }
}

export default withServiceCheck(Header);
