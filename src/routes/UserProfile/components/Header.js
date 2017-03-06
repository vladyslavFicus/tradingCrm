import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Amount from 'components/Amount';
import AccountStatus from './AccountStatus';
import { SubmissionError } from 'redux-form';
import ProfileTags from 'components/ProfileTags';
import Balances from './Balances';
import { statuses, statusColorNames } from 'constants/user';
import classNames from 'classnames';
import { shortify } from 'utils/uuid';
import NoteButton from './NoteButton';

import './Header.scss';

class Header extends Component {
  getUserAge = () => {
    const { data: { birthDate } } = this.props;

    return birthDate ? `(${moment().diff(birthDate, 'years')})` : null;
  };

  getRealWithBonusBalance = () => {
    const { accumulatedBalances: { data: { real, bonus } } } = this.props;

    return (
      <small>
        RM <Amount { ...real } /> + BM <Amount { ...bonus } />
      </small>
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
      throw new SubmissionError({ _error: 'User uuid not found.' })
    }
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
      },
      lastIp,
      availableStatuses,
      accumulatedBalances,
      availableTags,
      onAddNoteClick,
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
    const {
      country: lastLoginCountry,
      signInDate: lastLoginDate,
    } = lastIp;

    return (
      <div>
        <div className="row panel-heading">
          <div className="pull-left">
            <div className="player__account__name h1">
              {[firstName, lastName, this.getUserAge()].join(' ')}
            </div>
            <span className="player__account__ids">
                {[username, shortify(uuid, 'PL'), languageCode].join(' - ')}
              </span>
          </div>
          <div className="col-md-4">
            {profileTags && <ProfileTags
              onAdd={this.handleTagAdd}
              options={availableOptions}
              value={valueOptions}
              onDelete={this.handleTagDelete}
            />}
          </div>
          <div className="pull-right">
            <NoteButton
              id="header-add-note-button"
              className="btn btn-default-outline"
              onClick={onAddNoteClick}
            >
              Add note
            </NoteButton>
          </div>
        </div>

        <div className="row panel-body player-header-blocks">
            <AccountStatus
              profileStatus={profileStatus}
              onStatusChange={this.handleStatusChange}
              label={
                <div className="dropdown-tab">
                  <span className="font-size-11 text-uppercase">Account Status</span>
                  <div className={`player__account-bold ${statusColorNames[profileStatus]}`}>{profileStatus}</div>
                  {
                    !!suspendEndDate &&
                    <small className="player__account__status-scince">
                      Until {moment(suspendEndDate).format('L')}
                    </small>
                  }
                </div>
              }
              availableStatuses={availableStatuses}
            />

              <Balances
                label={
                  <div className="balance-tab">
                    <span className="font-size-11 text-uppercase">Balance</span>
                    <div className="player__account-bold">
                      <Amount { ...balance } />
                    </div>
                    { this.getRealWithBonusBalance() }
                  </div>
                }
                accumulatedBalances={accumulatedBalances}
              />

          <div className="width-20">
            <span className="font-size-11 text-uppercase">Registered</span>
            <div className="player__account-bold">
              { moment(registrationDate).fromNow() }
            </div>
            <small>
              on { moment(registrationDate).format('DD.MM.YYYY') } <br/>
            </small>
          </div>
          <div className="width-20">
            <span className="font-size-11 text-uppercase">Last login</span>
            <div>
              {lastLoginDate && moment(lastLoginDate).fromNow()}
            </div>
            <small>
              {lastLoginDate && moment(lastLoginDate).format('DD.MM.YYYY hh:mm')}
            </small>
            <small>{lastLoginCountry && ` from ${lastLoginCountry}`}</small>
          </div>
          <div className="width-20">
            <span className="font-size-11 text-uppercase">
              Affiliate {' '} { !!affiliateId && affiliateId}
            </span>
            <div className="player__account-bold">
              BTAG {'-'} { !!btag ? btag : 'Empty' }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
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
  availableStatuses: PropTypes.array,
  availableTags: PropTypes.array,
  onStatusChange: PropTypes.func.isRequired,
};

export default Header;
