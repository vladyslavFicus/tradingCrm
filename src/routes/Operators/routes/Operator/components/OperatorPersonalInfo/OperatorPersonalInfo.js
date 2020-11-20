import React, { PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { PersonalInformationItem } from 'components/Information';
import './OperatorPersonalInfo.scss';

class OperatorPersonalInfo extends PureComponent {
  static propTypes = {
    operator: PropTypes.operator.isRequired,
  };

  render() {
    const {
      operator: {
        email,
        country,
        lastName,
        firstName,
        phoneNumber,
        registrationDate,
      },
    } = this.props;

    return (
      <div className="OperatorPersonalInfo">
        <div className="OperatorPersonalInfo__title">
          {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.PERSONAL_INFORMATION')}
        </div>
        <div className="OperatorPersonalInfo__content">
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
    );
  }
}

export default OperatorPersonalInfo;
