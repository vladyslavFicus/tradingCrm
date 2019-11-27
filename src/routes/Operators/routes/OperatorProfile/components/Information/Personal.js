import React, { Fragment } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import PersonalInformationItem from '../../../../../../components/Information/PersonalInformationItem';
import PropTypes from '../../../../../../constants/propTypes';

const Personal = ({ data }) => {
  const {
    country,
    email,
    firstName,
    lastName,
    phoneNumber,
    registrationDate,
  } = data;

  return (
    <Fragment>
      <div className="account-details__label">
        {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.PERSONAL_INFORMATION')}
      </div>
      <div className="card">
        <div className="card-body">
          <PersonalInformationItem
            label={I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.FIRST_NAME')}
            value={firstName}
          />
          <PersonalInformationItem
            label={I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.LAST_NAME')}
            value={lastName}
          />
          <PersonalInformationItem
            label={I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.EMAIL')}
            value={email}
          />
          <PersonalInformationItem
            label={I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.COUNTRY')}
            value={country}
          />
          <PersonalInformationItem
            label={I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.PHONE_NUMBER')}
            value={phoneNumber}
          />
          <PersonalInformationItem
            label={I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.REGISTRATION_DATE')}
            value={moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
          />
        </div>
      </div>
    </Fragment>
  );
};

Personal.propTypes = {
  data: PropTypes.operatorProfile.isRequired,
};

export default Personal;
