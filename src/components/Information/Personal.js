import React, { Component } from 'react';
import moment from 'moment';
import PersonalInformationItem from './PersonalInformationItem';
import { statuses as kycStatuses } from '../../constants/kyc';
import { statuses as userStatuses } from '../../constants/user';

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
        addressStatus,
        personalStatus,
        profileStatus,
        phoneNumberVerified,
        city,
      },
    } = this.props;

    return (
      <div className="player__account__details_personal col-md-3">
        <span className="player__account__details_personal-label">Personal information</span>
        <div className="panel panel-with-borders">
          <div className="panel-body padding-5 height-200">
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
