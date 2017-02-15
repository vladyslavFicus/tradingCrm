import React, { Component, PropTypes } from 'react';
import moment from 'moment';

class Header extends Component {

  getFullYear = () => {
    const { data: { birthDate }} = this.props;

    return birthDate ? `(${moment().diff(birthDate, 'years')})` : null;
  };

  render() {
    const {
      data: {
        firstName,
        lastName,
        username,
        uuid,
        languageCode,
      },
    } = this.props;

    return (
      <div className="row panel-heading">
        <div className="col-md-8">
          <div className="player__account pull-left">
            <h1 className="player__account__name">
              {[firstName, lastName, this.getFullYear()].join(' ')}
              <i className="green fa fa-check"></i>
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
              <i className="fa fa-plus-square"></i>
            </a>
          </div>
        </div>
        <div className="col-md-4">
          <button type="button" className="btn margin-inline">Add note</button>
          <button type="button" className="btn margin-inline">Reset password</button>
        </div>
      </div>
    );
  }
}

Header.propTypes = {};
Header.defaultProps = {};

export default Header;
