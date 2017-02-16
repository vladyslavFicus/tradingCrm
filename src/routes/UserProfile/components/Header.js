import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Amount from 'components/Amount';

class Header extends Component {
  getUserAge = () => {
    const { data: { birthDate }} = this.props;

    return birthDate ? `(${moment().diff(birthDate, 'years')})` : null;
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
      },
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
            <div className="player__account__labels">
              <a href="#" className="label label-danger font-size-14 margin-inline">
                Negative
              </a>
              <a href="#" className="label label-default font-size-14 margin-inline">
                <i className="fa fa-plus-square" />
              </a>
            </div>
          </div>
          <div className="col-md-4">
            <button type="button" className="btn margin-inline">Add note</button>
            <button type="button" className="btn margin-inline">Reset password</button>
          </div>
        </div>

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
