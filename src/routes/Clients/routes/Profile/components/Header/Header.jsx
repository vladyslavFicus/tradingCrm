import React, { Component, Fragment } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'constants/propTypes';
import Regulated from 'components/Regulation';
import ActionsDropDown from 'components/ActionsDropDown';
import PopoverButton from 'components/PopoverButton';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import ProfileLastLogin from 'components/ProfileLastLogin';
import Uuid from 'components/Uuid';
import { statuses } from 'constants/user';
import PermissionContent from 'components/PermissionContent';
import StickyWrapper from 'components/StickyWrapper';
import PlayerStatus from '../PlayerStatus';
import Balances from '../Balances';
import HeaderPlayerPlaceholder from '../HeaderPlayerPlaceholder';
import Questionnaire from '../Questionnaire';

const sendActivationLinkPermission = new Permissions([permissions.USER_PROFILE.SEND_ACTIVATION_LINK]);
const changePasswordPermission = new Permissions([permissions.USER_PROFILE.CHANGE_PASSWORD]);
const resetPasswordPermission = new Permissions([permissions.OPERATORS.RESET_PASSWORD]);

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
    questionnaireLastData: PropTypes.object,
    onRefreshClick: PropTypes.func.isRequired,
    isLoadingProfile: PropTypes.bool.isRequired,
    lastIp: PropTypes.ipEntity,
    availableStatuses: PropTypes.array,
    onAddNoteClick: PropTypes.func.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    onResetPasswordClick: PropTypes.func.isRequired,
    onProfileActivateClick: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    loaded: PropTypes.bool,
    onChangePasswordClick: PropTypes.func.isRequired,
    onShareProfileClick: PropTypes.func.isRequired,
    unlockLogin: PropTypes.func.isRequired,
    loginLock: PropTypes.shape({
      lock: PropTypes.bool,
    }).isRequired,
  };

  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    lastIp: null,
    playerProfile: {},
    availableStatuses: [],
    loaded: false,

    // Can be null when brand is unregulated
    questionnaireLastData: null,
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
      loaded,
      onChangePasswordClick,
      onShareProfileClick,
      unlockLogin,
      loginLock: {
        lock,
      },
      questionnaireLastData,
    } = this.props;

    const { permissions: currentPermissions } = this.context;
    const fullName = [firstName, lastName].filter(i => i).join(' ');
    const isInactive = profileStatus === statuses.INACTIVE;
    const {
      baseCurrencyBalance,
      baseCurrencyCredit,
      baseCurrencyEquity,
      baseCurrencyMargin,
      lastWithdrawalDate,
      lastDepositDate,
      marginLevel,
      mt4Users,
    } = tradingProfile || {};

    return (
      <Fragment>
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
                  {username}
                  {' - '}
                  {
                    playerUUID
                    && (
                      <Uuid
                        uuid={playerUUID}
                        uuidPrefix={playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
                      />
                    )
                  }
                  {' - '}
                  {languageCode}
                </div>
              </div>
            </HeaderPlayerPlaceholder>
            <div className="panel-heading-row__actions">
              <If condition={lock}>
                <button
                  onClick={unlockLogin}
                  type="button"
                  className="btn btn-sm mx-3 btn-primary"
                >
                  {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.UNLOCK')}
                </button>
              </If>
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
                type="button"
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
                      visible: resetPasswordPermission.check(currentPermissions),
                    },
                    {
                      label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.SEND_ACTIVATION_LINK'),
                      onClick: onProfileActivateClick,
                      visible: sendActivationLinkPermission.check(currentPermissions) && isInactive,
                    },
                    {
                      label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
                      onClick: onChangePasswordClick,
                      visible: changePasswordPermission.check(currentPermissions),
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
                balances={{
                  baseCurrencyBalance,
                  baseCurrencyCredit,
                  baseCurrencyEquity,
                  baseCurrencyMargin,
                  currency,
                  marginLevel,
                }}
                mt4Users={mt4Users && mt4Users.filter(account => account.accountType !== 'DEMO')}
                lastDeposit={lastDepositDate}
                lastWithdraw={lastWithdrawalDate}
                playerUUID={playerUUID}
                locale={locale}
              />
            </If>
          </div>
          <Regulated>
            <Questionnaire questionnaireLastData={questionnaireLastData} profileUUID={playerUUID} />
          </Regulated>
          <ProfileLastLogin lastIp={lastIp} locale={locale} />
          <div className="header-block">
            <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.REGISTERED.TITLE')}</div>
            <div className="header-block-middle">
              {moment.utc(registrationDate).local().fromNow()}
            </div>
            <div className="header-block-small">
              {I18n.t('COMMON.ON')} {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Header;
