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
        kycAddressStatus,
        kycPersonalStatus,
        profileStatus,
        phoneNumberVerified,
        city,
        affiliateId,
        btag,
      },
    } = this.props;

    return (
      <div className="account-details__personal-info">
        <span className="account-details__label">Personal information</span>
        <div className="panel">
          <div className="panel-body">
            <PersonalInformationItem
              label="Date of birth"
              value={moment.utc(birthDate).local().format('DD.MM.YYYY')}
              verified={kycPersonalStatus && kycPersonalStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="Gender"
              value={gender}
              verified={kycPersonalStatus && kycPersonalStatus.status === kycStatuses.VERIFIED}
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
              verified={kycAddressStatus && kycAddressStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="Country"
              value={country}
              verified={kycAddressStatus && kycAddressStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="City"
              value={city}
              verified={kycAddressStatus && kycAddressStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="Source"
              value={affiliateId || <span className="color-default">no source</span>}
            />
            <PersonalInformationItem
              label="B-TAG"
              value={btag || <span className="color-default">no b-tag</span>}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Personal;
