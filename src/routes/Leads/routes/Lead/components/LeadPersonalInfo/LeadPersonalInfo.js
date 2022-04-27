import React, { PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import Flag from 'react-country-flag';
import {
  Click2CallPhone__Type__Enum as PhoneType,
  Click2CallCustomer__Type__Enum as CustomerType,
} from '__generated__/types';
import Uuid from 'components/Uuid';
import PropTypes from 'constants/propTypes';
import Click2Call from 'components/Click2Call';
import { PersonalInformationItem } from 'components/Information';
import countryList, { getCountryCode } from 'utils/countryList';
import './LeadPersonalInfo.scss';

class LeadPersonalInfo extends PureComponent {
  static propTypes = {
    lead: PropTypes.lead.isRequired,
  };

  render() {
    const {
      lead: {
        uuid,
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
            value={phone}
            additional={<Click2Call uuid={uuid} phoneType={PhoneType.PHONE} customerType={CustomerType.LEAD} />}
            className="LeadPersonalInfo__phone"
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.MOBILE')}
            value={mobile}
            additional={(
              <Click2Call
                uuid={uuid}
                phoneType={PhoneType.ADDITIONAL_PHONE}
                customerType={CustomerType.LEAD}
              />
            )}
            className="LeadPersonalInfo__phone"
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.EMAIL')}
            value={email}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.COUNTRY')}
            className="LeadPersonalInfo__country"
            value={(
              <Choose>
                <When condition={getCountryCode(country)}>
                  <Flag
                    svg
                    style={{
                      height: 10,
                    }}
                    countryCode={getCountryCode(country)}
                  />
                  {' '}
                  {countryList[getCountryCode(country)]}
                </When>
                <Otherwise>
                  <img src="/img/unknown-country-flag.svg" alt="" />
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
