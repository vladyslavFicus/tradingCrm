import React, { Fragment } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import Flag from 'react-world-flags';
import Uuid from 'components/Uuid';
import PropTypes from '../../../../../../constants/propTypes';
import languageNames from '../../../../../../constants/languageNames';
import PersonalInformationItem from '../../../../../../components/Information/PersonalInformationItem';
import countryList, { getCountryCode } from '../../../../../../utils/countryList';

const Personal = ({
  loading,
  data: {
    birthDate,
    gender,
    phone,
    email,
    country,
    city,
    language,
    source,
    affiliate,
    convertedToClientUuid,
    statusChangedDate,
  },
}) => {
  const profileLanguage = get('languageName', languageNames.find(item => item.languageCode === language))
    || languageNames[0].languageName;

  return (
    <Fragment>
      <div className="account-details__label">
        {I18n.t('LEAD_PROFILE.DETAILS.PERSONAL_INFORMATION')}
      </div>
      <div className="card">
        <div className="card-body">
          <If condition={!loading}>
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
            />
            <PersonalInformationItem
              label={I18n.t('LEAD_PROFILE.DETAILS.EMAIL')}
              value={email}
            />
            <PersonalInformationItem
              label={I18n.t('LEAD_PROFILE.DETAILS.COUNTRY')}
              className="lead-country"
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
            <PersonalInformationItem
              label={I18n.t('LEAD_PROFILE.DETAILS.LANGUAGE')}
              value={I18n.t(profileLanguage)}
            />
            <PersonalInformationItem
              label={I18n.t('LEAD_PROFILE.DETAILS.SOURCE')}
              value={source}
            />
            <PersonalInformationItem
              label={I18n.t('LEAD_PROFILE.DETAILS.AFFILIATE')}
              value={affiliate}
            />
            <If condition={convertedToClientUuid}>
              <div>
                <strong>{I18n.t('LEAD_PROFILE.DETAILS.CONVERTED_TO_CLIENT')}</strong>
                {': '}
                <Uuid uuid={convertedToClientUuid} />
              </div>
              <div>
                <strong>{I18n.t('LEAD_PROFILE.DETAILS.CONVERTED_SINCE')}</strong>
                {': '}
                {moment.utc(statusChangedDate).local().format('DD.MM.YYYY HH:mm:ss')}
              </div>
            </If>
          </If>
        </div>
      </div>
    </Fragment>
  );
};

Personal.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool.isRequired,
};

Personal.defaultProps = {
  data: {},
};

export default Personal;
