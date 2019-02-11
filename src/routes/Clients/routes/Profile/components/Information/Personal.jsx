import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import Uuid from 'components/Uuid';
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
      tradingProfile,
    },
  } = props;

  const affiliateProfile = get(tradingProfile, 'affiliateProfileDocument');

  return (
    <div className="account-details__personal-info">
      <span className="account-details__label">
        {I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}
      </span>
      <div className="card">
        <div className="card-body">
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.DATE_OF_BIRTH')}
            value={birthDate ? moment(birthDate).format('DD.MM.YYYY') : null}
            verified={kycPersonalStatus && kycPersonalStatus.status === kycStatuses.VERIFIED}
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.GENDER')}
            value={gender}
            verified={kycPersonalStatus && kycPersonalStatus.status === kycStatuses.VERIFIED}
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.PHONE')}
            value={tradingProfile ? tradingProfile.phone1 : ''}
            verified={phoneNumberVerified}
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.EMAIL')}
            value={email}
            verified={profileStatus === userStatuses.ACTIVE}
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.FULL_ADDRESS')}
            value={address}
            verified={kycAddressStatus && kycAddressStatus.status === kycStatuses.VERIFIED}
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.COUNTRY')}
            value={country}
            verified={kycAddressStatus && kycAddressStatus.status === kycStatuses.VERIFIED}
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.CITY')}
            value={city}
            verified={kycAddressStatus && kycAddressStatus.status === kycStatuses.VERIFIED}
          />
          <If condition={affiliateProfile}>
            <If condition={affiliateProfile.affiliate}>
              <PersonalInformationItem
                label={I18n.t('CLIENT_PROFILE.DETAILS.AFFILIATE')}
                value={affiliateProfile.affiliate.fullName}
              />
            </If>
            <strong>{I18n.t('CLIENT_PROFILE.DETAILS.AFFILIATE_ID')}</strong>: <Uuid uuid={affiliateProfile._id} />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.SOURCE')}
              value={
                affiliateProfile.source ||
                <span className="color-default">{I18n.t('CLIENT_PROFILE.DETAILS.NO_SOURCE')}</span>
              }
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.REFERRAL')}
              value={affiliateProfile.referral ||
              <span className="color-default">{I18n.t('CLIENT_PROFILE.DETAILS.NO_REFERRAL')}</span>}
            />
          </If>
          <If condition={tradingProfile && tradingProfile.convertedFromLeadUuid}>
            <strong>{I18n.t('CLIENT_PROFILE.DETAILS.CONVERTED_FROM_LEAD')}</strong>
            {': '}
            <Uuid uuid={tradingProfile.convertedFromLeadUuid} />
          </If>
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
