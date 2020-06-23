import React, { PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { PersonalInformationItem } from 'components/Information';
import './PartnerPersonalInfo.scss';

class PartnerPersonalInfo extends PureComponent {
  static propTypes = {
    partner: PropTypes.partner.isRequired,
  };

  render() {
    const {
      partner: {
        phone,
        email,
        country,
        lastName,
        firstName,
        createdAt,
      },
    } = this.props;

    return (
      <div className="PartnerPersonalInfo">
        <div className="PartnerPersonalInfo__title">
          {I18n.t('PARTNER_PROFILE.DETAILS.LABEL.PERSONAL_INFORMATION')}
        </div>
        <div className="PartnerPersonalInfo__content">
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
    );
  }
}

export default PartnerPersonalInfo;
