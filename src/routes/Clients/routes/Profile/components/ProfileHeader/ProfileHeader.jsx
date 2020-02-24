import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { getActiveBrandConfig } from 'config';
import { withPermission } from 'providers/PermissionsProvider';
import { fsaStatuses, fsaStatusColorNames, fsaStatusesLabels } from 'constants/fsaMigration';
import PropTypes from 'constants/propTypes';
import Regulated from 'components/Regulated';
import ActionsDropDown from 'components/ActionsDropDown';
import PopoverButton from 'components/PopoverButton';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import renderLabel from 'utils/renderLabel';
import ProfileLastLogin from 'components/ProfileLastLogin';
import Uuid from 'components/Uuid';
import { withNotifications } from 'components/HighOrder';
import PermissionContent from 'components/PermissionContent';
import StickyWrapper from 'components/StickyWrapper';
import MigrateButton from 'components/MigrateButton';
import customTimeout from 'utils/customTimeout';
import PlayerStatus from '../PlayerStatus';
import RiskStatus from '../RiskStatus';
import Balances from '../Balances';
import HeaderPlayerPlaceholder from '../HeaderPlayerPlaceholder';
import Questionnaire from '../Questionnaire';
import './ProfileHeader.scss';

const changePasswordPermission = new Permissions([permissions.USER_PROFILE.CHANGE_PASSWORD]);
const resetPasswordPermission = new Permissions([permissions.OPERATORS.RESET_PASSWORD]);

class ProfileHeader extends Component {
  static propTypes = {
    newProfile: PropTypes.newProfile,
    questionnaireLastData: PropTypes.object,
    onRefreshClick: PropTypes.func.isRequired,
    isLoadingProfile: PropTypes.bool.isRequired,
    availableStatuses: PropTypes.array,
    onAddNoteClick: PropTypes.func.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    onResetPasswordClick: PropTypes.func.isRequired,
    loaded: PropTypes.bool,
    onChangePasswordClick: PropTypes.func.isRequired,
    unlockLogin: PropTypes.func.isRequired,
    loginLock: PropTypes.shape({
      lock: PropTypes.bool,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
  };

  static defaultProps = {
    newProfile: {},
    availableStatuses: [],
    loaded: false,

    // Can be null when brand is unregulated
    questionnaireLastData: null,
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

  handleStatusChange = async ({ action, comment, reason }) => {
    const {
      newProfile: {
        uuid,
      },
      onStatusChange,
      notify,
    } = this.props;

    if (uuid) {
      const { error } = await onStatusChange({
        variables: {
          status: action,
          playerUUID: uuid,
          comment,
          reason,
        },
      });

      notify({
        level: error ? 'error' : 'success',
        message: error
          ? I18n.t('COMMON.SOMETHING_WRONG')
          : I18n.t('COMMON.SUCCESS'),
      });
    }
  };

  onHandeReloadClick = () => {
    const { onRefreshClick } = this.props;

    this.setState({ isRunningReloadAnimation: true });
    onRefreshClick();
  }

  render() {
    const {
      availableStatuses,
      onAddNoteClick,
      onResetPasswordClick,
      onRefreshClick,
      isLoadingProfile,
      loaded,
      onChangePasswordClick,
      unlockLogin,
      loginLock: {
        lock,
      },
      questionnaireLastData,
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
        fsaMigrationInfo: {
          fsaMigrationStatus,
        },
        tradingAccount,
      },
    } = this.props;

    const { isRunningReloadAnimation } = this.state;
    const lastActivityDate = get(lastActivity, 'date');

    const fullName = [firstName, lastName].filter(i => i).join(' ');

    return (
      <div className="ProfileHeader">
        <StickyWrapper top={48} innerZ={3} activeClass="heading-fixed">
          <If condition={
            getActiveBrandConfig().fsaRegulation
            && fsaMigrationStatus === fsaStatuses.MIGRATION_FINISHED}
          >
            <div className="panel-heading-row ProfileHeader__migration-notification">
              {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.MIGRATED_NOTIFICATION')}
            </div>
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
              <If condition={
                lock
                && !(getActiveBrandConfig().fsaRegulation && fsaMigrationStatus === fsaStatuses.MIGRATION_FINISHED)}
              >
                <button
                  onClick={unlockLogin}
                  type="button"
                  className="btn btn-sm mx-3 btn-primary"
                >
                  {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.UNLOCK')}
                </button>
              </If>

              <If
                condition={
                  getActiveBrandConfig().fsaRegulation
                  && fsaMigrationStatus === fsaStatuses.MIGRATION_ACCEPTED
                }
              >
                <PermissionContent permissions={permissions.USER_PROFILE.MIGRATE_TO_FSA}>
                  <MigrateButton
                    variables={{
                      clients: [{ uuid }],
                      totalElements: 1,
                      allRowsSelected: false,
                    }}
                    submitCallback={onRefreshClick}
                  />
                </PermissionContent>
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
                onClick={this.onHandeReloadClick}
                id="refresh-page-button"
              >
                <i
                  className={classNames(
                    'fa fa-refresh', { 'fa-spin': isRunningReloadAnimation || isLoadingProfile },
                  )}
                />
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
                      label: I18n.t('PLAYER_PROFILE.PROFILE.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
                      onClick: onChangePasswordClick,
                      visible: changePasswordPermission.check(currentPermissions),
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
              statusDate={changedAt}
              statusAuthor={changedBy}
              profileStatusComment={comment}
              status={statusType}
              reason={reason}
              onChange={this.handleStatusChange}
              availableStatuses={availableStatuses}
              fsaMigrationStatus={fsaMigrationStatus}
            />

            <If condition={getActiveBrandConfig().isRisksTabAvailable}>
              <RiskStatus />
            </If>

            <If condition={getActiveBrandConfig().fsaRegulation && fsaMigrationStatus}>
              <div className="header-block-inner margin-top-10">
                <div className="header-block-title">{I18n.t('MIGRATE.MIGRATION_STATUS')}</div>
                <div className={`${fsaStatusColorNames[fsaMigrationStatus]} header-block-middle text-uppercase`}>
                  {I18n.t(renderLabel(fsaMigrationStatus, fsaStatusesLabels))}
                </div>
              </div>
            </If>
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
          <Regulated>
            <Questionnaire questionnaireLastData={questionnaireLastData} profileUUID={uuid} />
          </Regulated>
          <ProfileLastLogin lastIp={lastSignInSessions ? lastSignInSessions[lastSignInSessions.length - 1] : null} />
          {lastActivityDate && (
            <div className="header-block header-block-inner">
              <div className="header-block-title">{I18n.t('PROFILE.LAST_ACTIVITY.TITLE')}</div>
              <div className="header-block-middle">
                {moment.utc(lastActivityDate).local().fromNow()}
              </div>
              <div className="header-block-small">
                {I18n.t('COMMON.ON')} {moment.utc(lastActivityDate).local().format('DD.MM.YYYY')}
              </div>
            </div>
          )}
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

export default withPermission(withNotifications(ProfileHeader));