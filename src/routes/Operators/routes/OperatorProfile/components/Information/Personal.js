import React, { Component } from 'react';
import moment from 'moment';
import PersonalInformationItem from '../../../../../../components/Information/PersonalInformationItem';
import PropTypes from '../../../../../../constants/propTypes';
import './Information.scss';

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
      <div className="player__account__details_personal">
        <span className="player__account__details-label">Personal information</span>
        <div className="panel">
          <div className="panel-body height-200">
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
              value={moment(registrationDate).format('DD.MM.YYYY HH:mm')}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Personal;
