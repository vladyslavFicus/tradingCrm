import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { SubmissionError } from 'redux-form';
import Sticky from 'react-stickynode';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../constants/propTypes';
import PlayerStatus from './PlayerStatus';
import ActionsDropDown from '../../../components/ActionsDropDown';
import Balances from './Balances';
import ProfileTags from '../../../components/ProfileTags';
import Amount from '../../../components/Amount';
import PopoverButton from '../../../components/PopoverButton';
import permissions from '../../../config/permissions';
import Permissions, { CONDITIONS } from '../../../utils/permissions';
import PlayerLimits from './PlayerLimits';
import ProfileLastLogin from '../../../components/ProfileLastLogin';
import Uuid from '../../../components/Uuid';
import HeaderPlayerPlaceholder from './HeaderPlayerPlaceholder';
import { statuses } from '../../../constants/user';
import PermissionContent from '../../../components/PermissionContent';

const sendActivationLinkPermission = new Permissions([permissions.USER_PROFILE.SEND_ACTIVATION_LINK]);
const playerLimitsPermission = [
  permissions.USER_PROFILE.GET_LOGIN_LOCK,
  permissions.USER_PROFILE.GET_PAYMENT_LOCKS,
];

class Header extends Component {
  static propTypes = {
    playerProfile: PropTypes.userProfile.isRequired,
    onRefreshClick: PropTypes.func.isRequired,
    isLoadingProfile: PropTypes.bool.isRequired,
    lastIp: PropTypes.ipEntity,
    accumulatedBalances: PropTypes.shape({
      real: PropTypes.price,
      bonus: PropTypes.price,
      total: PropTypes.price,
    }).isRequired,
    availableStatuses: PropTypes.array,
    availableTags: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
    })),
    currentTags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
    addTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
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
  };
  static defaultProps = {
    lastIp: null,
    availableTags: [],
    currentTags: [],
    availableStatuses: [],
    loaded: false,
    profileStatusDate: null,
    profileStatusAuthor: null,
  };
  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  getRealWithBonusBalance = () => {
    const { accumulatedBalances: { real, bonus } } = this.props;

    return (
      <div className="header-block-small">
        RM <Amount {...real} /> + BM <Amount {...bonus} />
      </div>
    );
  };

  handleTagAdd = (option) => {
    this.props.addTag(option.value, option.priority);
  };

  handleTagDelete = (option) => {
    this.props.deleteTag(option.id);
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
      playerProfile: {
        firstName,
        username,
        languageCode,
        lastName,
        profileStatusReason,
        profileStatus,
        playerUUID,
        registrationDate,
      },
      playerProfile,
      availableStatuses,
      accumulatedBalances,
      onAddNoteClick,
      onResetPasswordClick,
      onProfileActivateClick,
      onPlayerLimitChange,
      playerLimits,
      lastIp,
      onRefreshClick,
      isLoadingProfile,
      locale,
      availableTags,
      currentTags,
      loaded,
      onChangePasswordClick,
      onShareProfileClick,
    } = this.props;
    const { permissions: currentPermissions } = this.context;
    const fullName = `${firstName} ${lastName}`;

    return (
      <div>
        <Sticky top={0} bottomBoundary={0} innerZ="5">
          <div className="panel-heading-row">
            <HeaderPlayerPlaceholder ready={loaded}>
              <div className="panel-heading-row__info">
                <div className="panel-heading-row__info-title">
                  {fullName || I18n.t('PLAYER_PROFILE.PROFILE.HEADER.NO_FULLNAME')}
                  {' '}
                  ({'age' || '?'})
                  {' '}
                  {'kycCompleted' && <i className="fa fa-check text-success" />}
                </div>
                <div className="panel-heading-row__info-ids">
                  {username}
                  {' - '}
                  {
                    !!playerUUID &&
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
            <div className="panel-heading-row__tags">
              <ProfileTags
                onAdd={this.handleTagAdd}
                onDelete={this.handleTagDelete}
                options={availableTags}
                value={currentTags}
              />
            </div>
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
                  },
                  {
                    label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.SHARE_PROFILE'),
                    onClick: onShareProfileClick,
                  },
                ]}
              />
            </div>
          </div>
        </Sticky>

        <div className="layout-quick-overview">
          <div className="header-block header-block_account">
            <PlayerStatus
              locale={locale}
              status={profileStatus}
              reason={profileStatusReason}
              onChange={this.handleStatusChange}
              availableStatuses={availableStatuses}
            />
          </div>
          <div className="header-block header-block_balance" id="player-profile-balance-block">
            <Balances
              label={
                <div className="dropdown-tab">
                  <div className="header-block-title">Balance</div>
                  <div className="header-block-middle">
                    <Amount {...accumulatedBalances.total} amountId="player-total-balance-amount" />
                  </div>
                  {this.getRealWithBonusBalance()}
                </div>
              }
              accumulatedBalances={accumulatedBalances}
            />
          </div>
          <PermissionContent permissions={playerLimitsPermission} permissionsCondition={CONDITIONS.OR}>
            <div className="header-block header-block_player-limits">
              <PlayerLimits
                profile={playerProfile}
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
              on {moment.utc(registrationDate).local().format('DD.MM.YYYY')}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
