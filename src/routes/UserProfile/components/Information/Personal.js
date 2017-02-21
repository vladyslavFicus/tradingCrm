import React, { Component, PropTypes } from 'react';
import moment from 'moment';

class Personal extends Component {
  render() {
    const {
      data: {
        birthDate,
        gender,
        phoneNumber,
        email,
        country,
        address,
      },
    } = this.props;

    return (
      <div className="player__account__details_personal col-md-3">
        <span className="player__account__details_personal-label">Personal information</span>
        <div className="panel panel-with-borders">
          <div className="panel-body padding-5">
            {
              !!birthDate &&
              <div><b>Date of birth</b>: {moment(birthDate).format('DD.MM.YYYY')}</div>
            }
            {
              !!gender &&
              <div><b>Gender</b>: {gender}</div>
            }
            {
              !!phoneNumber &&
              <div><b>Phone</b>: {phoneNumber}</div>
            }
            {
              !!email &&
              <div><b>Email</b>: {email}</div>
            }

            {
              !!country &&
              <div><b>Country</b>: {country}</div>
            }
            {
              !!address &&
              <div><b>Address</b>: {address}</div>
            }
          </div>
        </div>
      </div>
    );
  }
}

Personal.propTypes = {};
Personal.defaultProps = {};

export default Personal;
