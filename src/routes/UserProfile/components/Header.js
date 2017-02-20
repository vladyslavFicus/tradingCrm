import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Amount from 'components/Amount';
import AccountStatus from './AccountStatus';
import { SubmissionError } from 'redux-form';
import Balances from './Balances';

class Header extends Component {
  getUserAge = () => {
    const { data: { birthDate } } = this.props;

    return birthDate ? `(${moment().diff(birthDate, 'years')})` : null;
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
        uuid,
        languageCode,
        btag,
        affiliateId,
        profileStatus,
        suspendEndDate,
      },
      availableStatuses,
      accumulatedBalances,
    } = this.props;

    return (
      <div>
        <div className="row panel-heading">
          <div className="col-md-8">
            <div className="player__account pull-left">
              <h1 className="player__account__name">
                {[firstName, lastName, this.getUserAge()].join(' ')}
                <i className="green fa fa-check"/>
              </h1>
              <span className="player__account__ids">
                {[username, uuid, languageCode].join(' - ')}
              </span>
            </div>
          </div>
        </div>

        <div className="row panel-body">
          <div className="player__account__status col-md-2">
            <AccountStatus
              onStatusChange={this.handleStatusChange}
              label={
                <div>
                  <span className="player__account__status-label text-uppercase">Account Status</span>
                  <div className="player__account__status-current-active">{profileStatus}</div>
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
          <div className="player__account__balance col-md-3">
            {
              <Balances
                label={
                  <div>
                    <span className="player__account__balance-label text-uppercase">Balance</span>
                    <div className="player__account__balance-current">
                      <Amount { ...balance } />
                    </div>
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
  }),
  availableStatuses: PropTypes.array,
  onStatusChange: PropTypes.func.isRequired,
};

export default Header;
