import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { SubmissionError } from 'redux-form';
import AccountStatus from './AccountStatus';
import UserProfileOptions from './UserProfileOptions';
import Balances from './Balances';
import ProfileTags from '../../../components/ProfileTags';
import Amount from '../../../components/Amount';
import NoteButton from '../../../components/NoteButton';
import { statusColorNames } from '../../../constants/user';
import { shortify } from '../../../utils/uuid';
import './Header.scss';

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
    lastIp: PropTypes.object,
    accumulatedBalances: PropTypes.object,
    availableStatuses: PropTypes.array,
    availableTags: PropTypes.array,
    addTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
    onAddNoteClick: PropTypes.func.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    onResetPasswordClick: PropTypes.func.isRequired,
    onProfileActivateClick: PropTypes.func.isRequired,
  };

  getUserAge = () => {
    const { data: { birthDate } } = this.props;

    return birthDate ? `(${moment().diff(birthDate, 'years')})` : null;
  };

  getRealWithBonusBalance = () => {
    const { accumulatedBalances: { real, bonus } } = this.props;

    return (
      <div className="header-block-secondary-text">
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

  renderLastLogin = () => {
    const { lastIp } = this.props;
    return !lastIp
      ? <div className="header-block-secondary-text">Unavailable</div>
      : [
        <div key="time-ago">{lastIp.signInDate && moment(lastIp.signInDate).fromNow()}</div>,
        <small key="time">{lastIp.signInDate && moment(lastIp.signInDate).format('DD.MM.YYYY hh:mm')}</small>,
        <small key="country">{lastIp.country && ` from ${lastIp.country}`}</small>,
      ];
  };

  render() {
    const {
      data: {
        balance,
        registrationDate,
        firstName,
        lastName,
        username,
        languageCode,
        btag,
        affiliateId,
        profileStatus,
        suspendEndDate,
        profileTags,
        uuid,
        kycCompleted,
        profileStatusReason,
      },
      availableStatuses,
      accumulatedBalances,
      availableTags,
      onAddNoteClick,
      onResetPasswordClick,
      onProfileActivateClick,
    } = this.props;
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
        <div className="row panel-heading">
          <div className="pull-left">
            <div className="player__account__name h1">
              {[firstName, lastName, this.getUserAge()].join(' ')}
              {' '}
              {kycCompleted && <i className="fa fa-check text-success" />}
            </div>
            <span className="player__account__ids">
              {[username, shortify(uuid, 'PL'), languageCode].join(' - ')}
            </span>
          </div>
          <div className="col-md-4">
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
          <div className="pull-right">
            <NoteButton
              id="header-add-note-button"
              className="btn btn-default-outline"
              onClick={onAddNoteClick}
            >
              Add note
            </NoteButton>
            {' '}
            <UserProfileOptions
              items={[
                { label: 'Reset password', onClick: onResetPasswordClick },
                { label: 'Send activation link', onClick: onProfileActivateClick },
              ]}
            />
          </div>
        </div>

        <div className="row panel-body header-blocks header-blocks-5">
          <div className="header-block">
            <AccountStatus
              profileStatus={profileStatus}
              onStatusChange={this.handleStatusChange}
              label={
                <div className="dropdown-tab">
                  <span className="header-title">Account Status</span>
                  <div className={`player__account-bold ${statusColorNames[profileStatus]}`}>{profileStatus}</div>
                  {
                    !!profileStatusReason &&
                    <span className="font-size-12 color-default">
                      by {profileStatusReason}
                    </span>
                  }
                  {
                    !!suspendEndDate &&
                    <span className="player__account__status-since font-size-12">
                      Until {moment(suspendEndDate).format('L')}
                    </span>
                  }
                </div>
              }
              availableStatuses={availableStatuses}
            />
          </div>
          <div className="header-block">
            <Balances
              label={
                <div className="balance-tab">
                  <span className="header-block-title">Balance</span>
                  <div className="header-block-text">
                    <Amount {...balance} />
                  </div>
                  { this.getRealWithBonusBalance() }
                </div>
              }
              accumulatedBalances={accumulatedBalances}
            />
          </div>

          <div className="header-block">
            <span className="header-block-title">Registered</span>
            <div className="header-block-text">
              { moment(registrationDate).fromNow() }
            </div>
            <small>
              on { moment(registrationDate).format('DD.MM.YYYY') } <br />
            </small>
          </div>
          <div className="header-block">
            <span className="header-block-title">Last login</span>
            {this.renderLastLogin()}
          </div>
          <div className="header-block">
            <span className="header-block-title">
              Affiliate {' '} { !!affiliateId && affiliateId}
            </span>
            <div className="header-block-text">
              BTAG {'-'} { btag || 'Empty' }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
