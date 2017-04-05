import React, { Component } from 'react';
import moment from 'moment';
import PersonalInformationItem from '../../../../../../components/Information/PersonalInformationItem';
import PropTypes from '../../../../../../constants/propTypes';

class Personal extends Component {
  static propTypes = {
    data: PropTypes.operatorProfile.isRequired,
  };

  render() {
    const {
      data: {
        country,
        email,
        firstName,
        lastName,
        phoneNumber,
        registrationDate,
      },
    } = this.props;

    return (
      <div className="player__account__details_personal col-md-3">
        <span className="player__account__details_personal-label">Personal information</span>
        <div className="panel panel-with-borders">
          <div className="panel-body padding-5 height-200">
            <PersonalInformationItem
              label="First Name"
              value={firstName}
            />
            <PersonalInformationItem
              label="Last Name"
              value={lastName}
            />
            <PersonalInformationItem
              label="Email"
              value={email}
            />
            <PersonalInformationItem
              label="Country"
              value={country}
            />
            <PersonalInformationItem
              label="Phone Number"
              value={phoneNumber}
            />
            <PersonalInformationItem
              label="Registration Date"
              value={moment(registrationDate).format('YYYY-MM-DD HH:mm')}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Personal;
