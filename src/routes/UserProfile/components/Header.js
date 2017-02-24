import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Amount from 'components/Amount';
import AccountStatus from './AccountStatus';
import { SubmissionError } from 'redux-form';
import ProfileTags from 'components/ProfileTags';
import Balances from './Balances';
import { statuses } from 'config/user';
import classNames from 'classnames';

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

  getUuid = () => {
    const { data: { uuid } } = this.props;

    return uuid ? 'PL-' + uuid.split('-', 2).join('-') : null;
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
                {[username, this.getUuid(), languageCode].join(' - ')}
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
          <div className={classNames('player__account__status col-md-2', {
            'cursor-pointer': profileStatus !== statuses.SUSPENDED,
          })}>
            <AccountStatus
              onStatusChange={this.handleStatusChange}
              label={
                <div>
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
          </div>
          <div className="player__account__balance col-md-3 cursor-pointer">
            {
              <Balances
                label={
                  <div>
                    <span className="player__account__balance-label text-uppercase">Balance</span>
                    <div className="player__account__balance-current">
                      <Amount { ...balance } />
                    </div>
                    { this.getRealWithBonusBalance() }
                  </div>
                }
                accumulatedBalances={accumulatedBalances}
              />
            }
          </div>
          <div className="player__account__registered col-md-2">
            <span className="player__account__registered-label text-uppercase">Registered</span>
            <div className="player__account__registered-current">
              { moment(registrationDate).fromNow() }
            </div>
            <small className="player__account__registered-date">
              on { moment(registrationDate).format('DD.MM.YYYY') } <br/>
            </small>
          </div>
          <div className="player__account__lastlogin col-md-2">
            <span className="player__account__lastlogin-label text-uppercase">Last login</span>
            <div className="player__account__lastlogin-current">
              13 Days ago
            </div>
            <small className="player__account__lastlogin-date">on 13.09.2016 13:00</small>
          </div>
          <div className="player__account__affiliate col-md-3">
            <span className="player__account__affiliate-label text-uppercase">
              Affiliate {' '} { !!affiliateId && affiliateId}
            </span>
            <div className="player__account__affiliate-current">
              BTAG {' '} { !!btag && btag }
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
