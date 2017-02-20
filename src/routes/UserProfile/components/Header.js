import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Amount from 'components/Amount';
import AccountStatus from './AccountStatus';
import { SubmissionError } from 'redux-form';

class Header extends Component {
  getUserAge = () => {
    const { data: { birthDate } } = this.props;

    return birthDate ? `(${moment().diff(birthDate, 'years')})` : null;
  };

  handleStatusChange = (data) => {
    if (this.props.data && this.props.data.uuid) {
      this.props.onStatusChange({ ...data, playerUUID: this.props.data.uuid });
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
            <a href="#">
              <span className="player__account__balance-label text-uppercase">Balance</span>
              <div className="player__account__balance-current">
                <Amount { ...balance } />
              </div>
            </a>
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

Header.propTypes = {};
Header.defaultProps = {};

export default Header;
