import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { SubmissionError } from 'redux-form';
import PropTypes from '../../../constants/propTypes';
import PlayerStatus from './PlayerStatus';
import UserProfileOptions from './UserProfileOptions';
import Balances from './Balances';
import ProfileTags from '../../../components/ProfileTags';
import Amount from '../../../components/Amount';
import PopoverButton from '../../../components/PopoverButton';
import permission from '../../../config/permissions';
import Permissions from '../../../utils/permissions';
import WalletLimits from './WalletLimits';
import ProfileLastLogin from '../../../components/ProfileLastLogin';
import Uuid from '../../../components/Uuid';
import HeaderPlayerPlaceholder from './HeaderPlayerPlaceholder';

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
    onWalletLimitChange: PropTypes.func.isRequired,
    walletLimits: PropTypes.shape({
      state: PropTypes.shape({
        entities: PropTypes.arrayOf(PropTypes.walletLimitEntity).isRequired,
        deposit: PropTypes.shape({
          locked: PropTypes.bool.isRequired,
          canUnlock: PropTypes.bool.isRequired,
        }).isRequired,
        withdraw: PropTypes.shape({
          locked: PropTypes.bool.isRequired,
          canUnlock: PropTypes.bool.isRequired,
        }).isRequired,
        error: PropTypes.object,
        isLoading: PropTypes.bool.isRequired,
        receivedAt: PropTypes.number,
      }).isRequired,
    }).isRequired,
    locale: PropTypes.string.isRequired,
    loaded: PropTypes.bool,
  };
  static defaultProps = {
    lastIp: null,
    availableTags: [],
    currentTags: [],
    availableStatuses: [],
    loaded: false,
  };
  static contextTypes = {
    permissions: PropTypes.array.isRequired,
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
      playerProfile,
      availableStatuses,
      accumulatedBalances,
      onAddNoteClick,
      onResetPasswordClick,
      onProfileActivateClick,
      onWalletLimitChange,
      walletLimits,
      lastIp,
      onRefreshClick,
      isLoadingProfile,
      locale,
      availableTags,
      currentTags,
      loaded,
    } = this.props;
    const { permissions: currentPermissions } = this.context;

    return (
      <div>
        <div className="panel-heading-row fixed-header">
          <HeaderPlayerPlaceholder ready={loaded}>
            <div className="panel-heading-row__info">
              <div className="panel-heading-row__info-title">
                {[playerProfile.fullName, `(${playerProfile.age})`].join(' ')}
                {' '}
                {playerProfile.kycCompleted && <i className="fa fa-check text-success" />}
              </div>
              <div className="panel-heading-row__info-ids">
                {playerProfile.username}
                {' - '}
                {
                  !!playerProfile.playerUUID &&
                  <Uuid
                    uuid={playerProfile.playerUUID}
                    uuidPrefix={playerProfile.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
                  />
                }
                {' - '}
                {playerProfile.languageCode}
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
            <PopoverButton
              id="header-add-note-button"
              className="btn btn-sm btn-default-outline"
              onClick={onAddNoteClick}
            >
              Add note
            </PopoverButton>
            <button
              className="btn btn-sm btn-default-outline m-x-1"
              onClick={onRefreshClick}
              id="refresh-page-button"
            >
              <i className={classNames('fa fa-refresh', { 'fa-spin': isLoadingProfile })} />
            </button>
            <UserProfileOptions
              items={[
                { label: 'Reset password', onClick: onResetPasswordClick },
                {
                  label: 'Send activation link',
                  onClick: onProfileActivateClick,
                  visible: (new Permissions([permission.USER_PROFILE.SEND_ACTIVATION_LINK])).check(currentPermissions),
                },
              ]}
            />
          </div>
        </div>

        <div className="panel-heading panel-heading_with-fixed-header">
          <div className="row">
            <div className="header-block header-block_account">
              <PlayerStatus
                locale={locale}
                status={playerProfile.profileStatus}
                reason={playerProfile.profileStatusReason}
                endDate={playerProfile.suspendEndDate}
                onChange={this.handleStatusChange}
                availableStatuses={availableStatuses}
              />
            </div>
            <div className="header-block header-block_balance">
              <Balances
                label={
                  <div className="dropdown-tab">
                    <div className="header-block-title">Balance</div>
                    <div className="header-block-middle">
                      <Amount {...accumulatedBalances.total} />
                    </div>
                    {this.getRealWithBonusBalance()}
                  </div>
                }
                accumulatedBalances={accumulatedBalances}
              />
            </div>
            <div className="header-block header-block_wallet-limits">
              <WalletLimits
                profile={playerProfile}
                limits={walletLimits.state}
                onChange={onWalletLimitChange}
              />
            </div>
            <ProfileLastLogin lastIp={lastIp} />
            <div className="header-block">
              <div className="header-block-title">Registered</div>
              <div className="header-block-middle">
                {moment.utc(playerProfile.registrationDate).local().fromNow()}
              </div>
              <div className="header-block-small">
                on {moment(playerProfile.registrationDate).format('DD.MM.YYYY')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
