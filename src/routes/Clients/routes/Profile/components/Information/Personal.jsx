import React from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PersonalInformationItem from '../../../../../../components/Information/PersonalInformationItem';
import PropTypes from '../../../../../../constants/propTypes';
import { statuses as kycStatuses } from '../../../../../../constants/kyc';
import { statuses as userStatuses } from '../../../../../../constants/user';

const Personal = (props) => {
  const {
    data: {
      birthDate,
      gender,
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
      tradingProfile,
    },
  } = props;

  return (
    <div className="account-details__personal-info">
      <span className="account-details__label">
        {I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}
      </span>
      <div className="card">
        <div className="card-body">
          <PersonalInformationItem
            label="Date of birth"
            value={birthDate ? moment(birthDate).format('DD.MM.YYYY') : null}
            verified={kycPersonalStatus && kycPersonalStatus.status === kycStatuses.VERIFIED}
          />
          <PersonalInformationItem
            label="Gender"
            value={gender}
            verified={kycPersonalStatus && kycPersonalStatus.status === kycStatuses.VERIFIED}
          />
          <PersonalInformationItem
            label="Phone"
            value={tradingProfile ? tradingProfile.phone1 : ''}
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
};

Personal.propTypes = {
  data: PropTypes.shape({
    address: PropTypes.string,
    affiliateId: PropTypes.string,
    birthDate: PropTypes.string,
    btag: PropTypes.string,
    city: PropTypes.string,
    completed: PropTypes.bool,
    country: PropTypes.string,
    email: PropTypes.string,
    gender: PropTypes.string,
    kycPersonalStatus: PropTypes.string,
    profileVerified: PropTypes.bool,
    languageCode: PropTypes.string,
    kycAddressStatus: PropTypes.string,
    phoneNumber: PropTypes.string,
    phoneNumberVerified: PropTypes.bool,
    postCode: PropTypes.string,
    login: PropTypes.string,
    username: PropTypes.string,
    playerUUID: PropTypes.string,
  }),
};

Personal.defaultProps = {
  data: {},
};

export default Personal;
