import React from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PersonalInformationItem from '../../../../../../components/Information/PersonalInformationItem';
import PropTypes from '../../../../../../constants/propTypes';

const Personal = ({ data: {
  country,
  email,
  firstName,
  lastName,
  phoneNumber,
  registrationDate,
} }) => (
  <div className="player__account__details_personal">
    <span className="player__account__details-label">
      {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.PERSONAL_INFORMATION')}
    </span>
    <div className="panel">
      <div className="panel-body height-200">
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
          value={moment(registrationDate).format('DD.MM.YYYY HH:mm')}
        />
      </div>
    </div>
  </div>
);

Personal.propTypes = {
  data: PropTypes.operatorProfile.isRequired,
};

export default Personal;
