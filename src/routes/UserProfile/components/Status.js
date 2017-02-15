import React, { Component, PropTypes } from 'react';
import Amount from 'components/Amount';
import moment from 'moment';

class Status extends Component {
  render() {
    const {
      data: {
        balance,
        registrationDate,
      },
    } = this.props;

    return (
      <div className="row panel-body">
        <div className="player__account__status col-md-2">
          <a href="#">
            <span className="player__account__status-label text-uppercase">Account Status</span>
            <div className="player__account__status-current-active">Active</div>
            <small className="player__account__status-scince">Since 15.11.2016</small>
          </a>
        </div>
        <div className="player__account__balance col-md-3">
          <a href="#">
            <span className="player__account__balance-label text-uppercase">Balance</span>
            <div className="player__account__balance-current">
              <Amount { ...balance } />
            </div>
            <small className="player__account__balance-additional">RM €15.205,00 + BM €5.000,00</small>
          </a>
        </div>
        <div className="player__account__registered col-md-2">
          <span className="player__account__registered-label text-uppercase">Registered</span>
          <div className="player__account__registered-current">
            { moment(registrationDate).fromNow() }
          </div>
          <small className="player__account__registered-date">
            on { moment(registrationDate).format('DD.MM.YYYY') } <br/>
            from Ukraine
          </small>
        </div>
        <div className="player__account__lastlogin col-md-2">
          <span className="player__account__lastlogin-label text-uppercase">Last login</span>
          <div className="player__account__lastlogin-current">
            13 Days ago
          </div>
          <small className="player__account__lastlogin-date">on 13.09.2016 13:00<br/> from Ukraine</small>
        </div>
        <div className="player__account__affiliate col-md-3">
          <span className="player__account__affiliate-label text-uppercase">Affiliate</span>
          <div className="player__account__affiliate-current">BTAG 97897897897897879876</div>
        </div>
      </div>
    );
  }
}

Status.propTypes = {};
Status.defaultProps = {};

export default Status;
