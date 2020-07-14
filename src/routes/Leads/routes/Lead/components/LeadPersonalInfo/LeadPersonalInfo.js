import React, { PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import Flag from 'react-world-flags';
import Uuid from 'components/Uuid';
import { hideText } from 'utils/hideText';
import PropTypes from 'constants/propTypes';
import Click2Call from 'components/Click2Call';
import { PersonalInformationItem } from 'components/Information';
import countryList, { getCountryCode } from 'utils/countryList';
import './LeadPersonalInfo.scss';

class LeadPersonalInfo extends PureComponent {
  static propTypes = {
    lead: PropTypes.lead.isRequired,
    isPhoneHidden: PropTypes.bool.isRequired,
    isEmailHidden: PropTypes.bool.isRequired,
  };

  render() {
    const {
      lead: {
        birthDate,
        gender,
        phone,
        mobile,
        email,
        country,
        city,
        language,
        source,
        affiliate,
        convertedToClientUuid,
        statusChangedDate,
      },
      isPhoneHidden,
      isEmailHidden,
    } = this.props;

    return (
      <div className="LeadPersonalInfo">
        <div className="LeadPersonalInfo__title">
          {I18n.t('LEAD_PROFILE.DETAILS.PERSONAL_INFORMATION')}
        </div>

        <div className="LeadPersonalInfo__content">
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.DATE_OF_BIRTH')}
            value={(
              <Choose>
                <When condition={birthDate}>
                  {moment.utc(birthDate).local().format('DD.MM.YYYY')}
                </When>
                <Otherwise>
                  <span>&mdash;</span>
                </Otherwise>
              </Choose>
            )}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.GENDER')}
            value={gender}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.PHONE')}
            value={isPhoneHidden ? hideText(phone) : phone}
            additional={<Click2Call number={phone} />}
            className="LeadPersonalInfo__phone"
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.MOBILE')}
            value={isPhoneHidden ? hideText(mobile) : mobile}
            additional={<Click2Call number={mobile} />}
            className="LeadPersonalInfo__phone"
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.EMAIL')}
            value={isEmailHidden ? hideText(email) : email}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.COUNTRY')}
            className="LeadPersonalInfo__country"
            value={(
              <Choose>
                <When condition={country}>
                  <Flag height={10} code={getCountryCode(country)} />
                  {' '}
                  {countryList[country.toUpperCase()]}
                </When>
                <Otherwise>
                  <span>&mdash;</span>
                </Otherwise>
              </Choose>
            )}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.CITY')}
            value={city}
          />
          <If condition={language}>
            <PersonalInformationItem
              label={I18n.t('LEAD_PROFILE.DETAILS.LANGUAGE')}
              value={I18n.t(`COMMON.LANGUAGE_NAME.${language.toUpperCase()}`, {
                defaultValue: language.toUpperCase(),
              })}
            />
          </If>
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.SOURCE')}
            value={source}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.AFFILIATE')}
            value={affiliate}
          />
          <If condition={convertedToClientUuid}>
            <PersonalInformationItem
              label={I18n.t('LEAD_PROFILE.DETAILS.CONVERTED_TO_CLIENT')}
              value={<Uuid uuid={convertedToClientUuid} />}
            />
            <PersonalInformationItem
              label={I18n.t('LEAD_PROFILE.DETAILS.CONVERTED_SINCE')}
              value={moment.utc(statusChangedDate).local().format('DD.MM.YYYY HH:mm:ss')}
            />
          </If>
        </div>
      </div>
    );
  }
}

export default LeadPersonalInfo;
