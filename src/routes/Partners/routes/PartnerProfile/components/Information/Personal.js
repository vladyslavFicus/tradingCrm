import React, { Fragment } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import PersonalInformationItem from '../../../../../../components/Information/PersonalInformationItem';

const Personal = ({ data }) => {
  const { phone, email, country, lastName, firstName, createdAt } = data;

  return (
    <Fragment>
      <div className="account-details__label">
        {I18n.t('PARTNER_PROFILE.DETAILS.LABEL.PERSONAL_INFORMATION')}
      </div>
      <div className="card">
        <div className="card-body">
          <PersonalInformationItem
            label={I18n.t('PARTNER_PROFILE.DETAILS.LABEL.FIRST_NAME')}
            value={firstName}
          />
          <PersonalInformationItem
            label={I18n.t('PARTNER_PROFILE.DETAILS.LABEL.LAST_NAME')}
            value={lastName}
          />
          <PersonalInformationItem
            label={I18n.t('PARTNER_PROFILE.DETAILS.LABEL.EMAIL')}
            value={email}
          />
          <PersonalInformationItem
            label={I18n.t('PARTNER_PROFILE.DETAILS.LABEL.COUNTRY')}
            value={country}
          />
          <PersonalInformationItem
            label={I18n.t('PARTNER_PROFILE.DETAILS.LABEL.PHONE_NUMBER')}
            value={phone}
          />
          <PersonalInformationItem
            label={I18n.t('PARTNER_PROFILE.DETAILS.LABEL.REGISTRATION_DATE')}
            value={moment.utc(createdAt).local().format('DD.MM.YYYY HH:mm')}
          />
        </div>
      </div>
    </Fragment>
  );
};

Personal.propTypes = {
  ...PropTypes.partnerProfile.isRequired,
};

export default Personal;
