import React, { Fragment, PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import Flag from 'react-world-flags';
import Uuid from 'components/Uuid';
import { hideText } from 'utils/hideText';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { PersonalInformationItem } from 'components/Information';
import Click2Call from 'components/Click2Call';
import countryList, { getCountryCode } from 'utils/countryList';
import './Personal.scss';

class Personal extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    isPhoneHidden: PropTypes.bool.isRequired,
    isEmailHidden: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    data: {},
  };

  render() {
    const {
      loading,
      data: {
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
                value={isPhoneHidden ? hideText(phone) : phone}
                additional={<Click2Call number={phone} />}
                className="Personal__contacts"
              />
              <PersonalInformationItem
                label={I18n.t('LEAD_PROFILE.DETAILS.MOBILE')}
                value={isPhoneHidden ? hideText(mobile) : mobile}
                additional={<Click2Call number={mobile} />}
                className="Personal__contacts"
              />
              <PersonalInformationItem
                label={I18n.t('LEAD_PROFILE.DETAILS.EMAIL')}
                value={isEmailHidden ? hideText(email) : email}
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
  }
}

export default compose(
  withNotifications,
)(Personal);
