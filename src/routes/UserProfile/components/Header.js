import React, { Component } from 'react';
import moment from 'moment';
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
import './Header.scss';
import WalletLimits from './WalletLimits';
import ProfileLastLogin from '../../../components/ProfileLastLogin';
import Uuid from '../../../components/Uuid';

class Header extends Component {
  static propTypes = {
    data: PropTypes.shape({
      balance: PropTypes.object,
      registrationDate: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      username: PropTypes.string,
      uuid: PropTypes.string,
      languageCode: PropTypes.string,
      btag: PropTypes.string,
      affiliateId: PropTypes.string,
      profileStatus: PropTypes.string,
      suspendEndDate: PropTypes.string,
      profileTags: PropTypes.array,
    }),
    lastIp: PropTypes.ipEntity,
    accumulatedBalances: PropTypes.object,
    availableStatuses: PropTypes.array,
    availableTags: PropTypes.array,
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
    }),
  };
  static contextTypes = {
    permissions: PropTypes.array.isRequired,
  };

  getUserAge = () => {
    const { data: { birthDate } } = this.props;

    return birthDate ? `(${moment().diff(birthDate, 'years')})` : null;
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
    const { data: profileData, onStatusChange } = this.props;

    if (profileData && profileData.uuid) {
      onStatusChange({ ...data, playerUUID: profileData.uuid });
    } else {
      throw new SubmissionError({ _error: 'User uuid not found.' });
    }
  };

  render() {
    const {
      data: {
        registrationDate,
        firstName,
        lastName,
        username,
        languageCode,
        profileStatus,
        suspendEndDate,
        profileTags,
        uuid,
        kycCompleted,
        profileStatusReason,
      },
      data: profile,
      availableStatuses,
      accumulatedBalances,
      availableTags,
      onAddNoteClick,
      onResetPasswordClick,
      onProfileActivateClick,
      onWalletLimitChange,
      walletLimits,
      lastIp,
    } = this.props;
    const { permissions: currentPermissions } = this.context;
    const selectedTags = profileTags
      ? profileTags.map(option => `${option.tagPriority}/${option.tag}`)
      : [];
    const availableOptions = selectedTags && availableTags
      ? availableTags.filter(option => selectedTags.indexOf(`${option.priority}/${option.value}`) === -1)
      : [];
    const valueOptions = profileTags
      ? profileTags.map(option => ({
        id: option.id,
        label: option.tag,
        value: option.tag,
        priority: option.tagPriority,
      }))
      : [];

    return (
      <div>
        <div className="panel-heading-row">
          <div className="panel-heading-row_name-and-ids">
            <div className="player__account__name">
              {[firstName, lastName, this.getUserAge()].join(' ')}
              {' '}
              {kycCompleted && <i className="fa fa-check text-success" />}
            </div>
            <div className="player__account__ids">
              <span>{username}</span> {' - '}
              {uuid && <Uuid uuid={uuid} uuidPrefix="PL" />} {' - '}
              <span>{languageCode}</span>
            </div>
          </div>
          <div className="panel-heading-row_tags">
            {
              profileTags &&
              <ProfileTags
                onAdd={this.handleTagAdd}
                options={availableOptions}
                value={valueOptions}
                onDelete={this.handleTagDelete}
              />
            }
          </div>
          <div className="panel-heading-row_add-note">
            <PopoverButton
              id="header-add-note-button"
              className="btn btn-default-outline"
              onClick={onAddNoteClick}
            >
              Add note
            </PopoverButton>
            {' '}
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

        <div className="row panel-body header-blocks header-blocks-5">
          <div className="header-block header-block_account">
            <PlayerStatus
              status={profileStatus}
              reason={profileStatusReason}
              endDate={suspendEndDate}
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
              profile={profile}
              limits={walletLimits.state}
              onChange={onWalletLimitChange}
            />
          </div>
          <ProfileLastLogin lastIp={lastIp} />
          <div className="header-block">
            <div className="header-block-title">Registered</div>
            <div className="header-block-middle">
              {moment(registrationDate).fromNow()}
            </div>
            <div className="header-block-small">
              on {moment(registrationDate).format('DD.MM.YYYY')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
