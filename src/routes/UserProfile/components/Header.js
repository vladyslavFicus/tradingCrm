import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Amount from 'components/Amount';
import AccountStatus from './AccountStatus';
import { SubmissionError } from 'redux-form';
import ProfileTags from 'components/ProfileTags';
import Balances from './Balances';
import { statuses } from 'constants/user';
import { shortify } from 'utils/uuid';

const statusColorNames = {
  [statuses.ACTIVE]: 'color-success',
  [statuses.INACTIVE]: 'color-warning',
  [statuses.BLOCKED]: 'color-danger',
  [statuses.SUSPENDED]: 'color-secondary',
};

class Header extends Component {
  getUserAge = () => {
    const { data: { birthDate } } = this.props;

    return birthDate ? `(${moment().diff(birthDate, 'years')})` : null;
  };

  getRealWithBonusBalance = () => {
    const { accumulatedBalances: { data: { real, bonus } } } = this.props;

    return (
      <small className="player__account__balance-additional">
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
      availableStatuses,
      accumulatedBalances,
      availableTags,
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
        </div>

        <div className="row panel-body player-header-blocks">
            <AccountStatus
              profileStatus={profileStatus}
              onStatusChange={this.handleStatusChange}
              label={
                <div className="dropdown-tab">
                  <span className="player__account__status-label text-uppercase">Account Status</span>
                  <div className={`player__account__status-current ${statusColorNames[profileStatus]}`}>{profileStatus}</div>
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
                    <span className="player__account__balance-label text-uppercase">Balance</span>
                    <div className="player__account__balance-current">
                      <Amount { ...balance } />
                    </div>
                    { this.getRealWithBonusBalance() }
                  </div>
                }
                accumulatedBalances={accumulatedBalances}
              />

          <div className="player__account__registered width-20">
            <span className="player__account__registered-label text-uppercase">Registered</span>
            <div className="player__account__registered-current">
              { moment(registrationDate).fromNow() }
            </div>
            <small className="player__account__registered-date">
              on { moment(registrationDate).format('DD.MM.YYYY') } <br/>
            </small>
          </div>
          <div className="player__account__lastlogin width-20">
            <span className="player__account__lastlogin-label text-uppercase">Last login</span>
            <div className="player__account__lastlogin-current">
              unavailable
            </div>
            <small className="player__account__lastlogin-date">unavailable</small>
          </div>
          <div className="player__account__affiliate width-20">
            <span className="player__account__affiliate-label text-uppercase">
              Affiliate {' '} { !!affiliateId && affiliateId}
            </span>
            <div className="player__account__affiliate-current">
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
  availableStatuses: PropTypes.array,
  availableTags: PropTypes.array,
  onStatusChange: PropTypes.func.isRequired,
};

export default Header;
