import React, { Component, Fragment } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import PlayerStatus from '../PlayerStatus';
import ActionsDropDown from '../../../../../../components/ActionsDropDown';
import Balances from '../Balances';
import ProfileTags from '../../../../../../components/ProfileTags';
import PopoverButton from '../../../../../../components/PopoverButton';
import permissions from '../../../../../../config/permissions';
import Permissions from '../../../../../../utils/permissions';
import Volume from '../Volume';
import ProfileLastLogin from '../../../../../../components/ProfileLastLogin';
import Uuid from '../../../../../../components/Uuid';
import HeaderPlayerPlaceholder from '../HeaderPlayerPlaceholder';
import { statuses } from '../../../../../../constants/user';
import { services } from '../../../../../../constants/services';
import PermissionContent from '../../../../../../components/PermissionContent';
import { withServiceCheck } from '../../../../../../components/HighOrder';
import StickyWrapper from '../../../../../../components/StickyWrapper';
import ActivePlan from '../ActivePlan';

const sendActivationLinkPermission = new Permissions([permissions.USER_PROFILE.SEND_ACTIVATION_LINK]);

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
      currency: PropTypes.string,
      email: PropTypes.string,
      firstName: PropTypes.string,
      gender: PropTypes.string,
      profileVerified: PropTypes.bool,
      languageCode: PropTypes.string,
      lastName: PropTypes.string,
      marketingMail: PropTypes.bool,
      marketingNews: PropTypes.bool,
      marketingSMS: PropTypes.bool,
      phoneNumber: PropTypes.string,
      phoneNumberVerified: PropTypes.bool,
      postCode: PropTypes.string,
      login: PropTypes.string,
      username: PropTypes.string,
      playerUUID: PropTypes.string,
      signInIps: PropTypes.arrayOf(PropTypes.ipEntity),
      profileStatusComment: PropTypes.string,
      tradingProfile: PropTypes.tradingProfile,
    }),
    onRefreshClick: PropTypes.func.isRequired,
    isLoadingProfile: PropTypes.bool.isRequired,
    lastIp: PropTypes.ipEntity,
    availableStatuses: PropTypes.array,
    availableTags: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
    })),
    currentTags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
    addTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
    onAddNoteClick: PropTypes.func.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    onResetPasswordClick: PropTypes.func.isRequired,
    onProfileActivateClick: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    loaded: PropTypes.bool,
    onChangePasswordClick: PropTypes.func.isRequired,
    onShareProfileClick: PropTypes.func.isRequired,
    checkService: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lastIp: null,
    playerProfile: {},
    availableTags: [],
    currentTags: [],
    availableStatuses: [],
    loaded: false,
  };

  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
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
        age,
        firstName,
        username,
        languageCode,
        currency,
        lastName,
        profileStatusAuthor,
        profileStatusDate,
        profileStatusReason,
        profileStatusComment,
        suspendEndDate,
        profileStatus,
        profileVerified,
        playerUUID,
        registrationDate,
        totalBalance,
        tradingProfile,
      },
      availableStatuses,
      onAddNoteClick,
      onResetPasswordClick,
      onProfileActivateClick,
      lastIp,
      onRefreshClick,
      isLoadingProfile,
      locale,
      availableTags,
      currentTags,
      loaded,
      onChangePasswordClick,
      onShareProfileClick,
      checkService,
    } = this.props;

    const { permissions: currentPermissions } = this.context;
    const fullName = [firstName, lastName].filter(i => i).join(' ');
    const { equity, lastWithdrawalDate, lastDepositDate } = tradingProfile || { equity: '0' };
    const { amount: balance } = totalBalance || 0;

    return (
      <Fragment>
        <StickyWrapper top={0} innerZ={3} activeClass="heading-fixed">
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
            />
          </div>
          <div className="header-block header-block_balance" id="player-profile-balance-block">
            <If condition={playerUUID}>
              <Balances
                balances={{ balance, equity, currency }}
                lastDeposit={lastDepositDate}
                lastWithdraw={lastWithdrawalDate}
                playerUUID={playerUUID}
              />
            </If>
          </div>
          <div className="header-block header-block_player-volume">
            <Volume />
          </div>
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
