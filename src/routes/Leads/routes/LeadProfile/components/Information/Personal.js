import React, { Fragment } from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Flag from 'react-world-flags';
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
  },
}) => (
  <Fragment>
    <div className="account-details__label">
      {I18n.t('LEAD_PROFILE.DETAILS.PERSONAL_INFORMATION')}
    </div>
    <div className="card">
      <div className="card-body">
        <If condition={!loading}>
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.DATE_OF_BIRTH')}
            value={moment.utc(birthDate).local().format('DD.MM.YYYY')}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.GENDER')}
            value={gender}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.PHONE')}
            value={`+${phone}`}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.EMAIL')}
            value={email}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.COUNTRY')}
            className="lead-country"
            value={
              <Fragment>
                <Flag height={10} code={getCountryCode(country)} />
                {' '}
                {countryList[country.toUpperCase()]}
              </Fragment>
            }
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.CITY')}
            value={city}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.LANGUAGE')}
            value={I18n.t(languageNames.find(item => item.languageCode === language).languageName)}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.SOURCE')}
            value={source}
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.AFFILIATE')}
            value={affiliate}
          />
        </If>
      </div>
    </div>
  </Fragment>
);

Personal.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool.isRequired,
};

Personal.defaultProps = {
  data: {},
};

export default Personal;
