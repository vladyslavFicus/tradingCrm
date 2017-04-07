import React, { Component } from 'react';
import moment from 'moment';
import PersonalInformationItem from '../../../../components/Information/PersonalInformationItem';
import PropTypes from '../../../../constants/propTypes';
import { statuses as kycStatuses } from '../../../../constants/kyc';
import { statuses as userStatuses } from '../../../../constants/user';

class Personal extends Component {
  static propTypes = {
    data: PropTypes.userProfile.isRequired,
  };

  render() {
    const {
      data: {
        birthDate,
        gender,
        phoneNumber,
        email,
        country,
        address,
        addressStatus,
        personalStatus,
        profileStatus,
        phoneNumberVerified,
        city,
      },
    } = this.props;

    return (
      <div className="player__account__details_personal">
        <span className="player__account__details-label">Personal information</span>
        <div className="panel">
          <div className="panel-body height-200">
            <PersonalInformationItem
              label="Date of birth"
              value={moment(birthDate).format('DD.MM.YYYY')}
              verified={personalStatus.value === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="Gender"
              value={gender}
              verified={personalStatus.value === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="Phone"
              value={phoneNumber}
              verified={phoneNumberVerified}
            />
            <PersonalInformationItem
              label="Email"
              value={email}
              verified={profileStatus === userStatuses.ACTIVE}
            />
            <PersonalInformationItem
              label="Full address"
              value={address}
              verified={addressStatus.value === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="Country"
              value={country}
              verified={addressStatus.value === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="City"
              value={city}
              verified={addressStatus.value === kycStatuses.VERIFIED}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Personal;
