import React, { Fragment, PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import { compose } from 'react-apollo';
import Flag from 'react-world-flags';
import Uuid from 'components/Uuid';
import { hideText } from 'utils/hideText';
import { withNotifications } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import languageNames from 'constants/languageNames';
import { PersonalInformationItem } from 'components/Information';
import countryList, { getCountryCode } from 'utils/countryList';
import { getBrand, getClickToCall } from 'config';
import ClickToCallMutation from './graphql/ClickToCallMutation';
import './Personal.scss';

class Personal extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
    clickToCall: PropTypes.func.isRequired,
    auth: PropTypes.auth.isRequired,
  };

  static defaultProps = {
    data: {},
  };

  handleClickToCall = async (number) => {
    const { notify, clickToCall } = this.props;

    const { data: { profile: { clickToCall: { success } } } } = await clickToCall(
      {
        variables: {
          number,
        },
      },
    );

    if (!success) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('LEAD_PROFILE.PERSONAL.CLICK_TO_CALL_FAILED'),
      });
    }
  };

  render() {
    const {
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
      auth: {
        department,
      },
    } = this.props;

    const withCall = getClickToCall().isActive;
    const isPhoneHidden = getBrand().privatePhoneByDepartment.includes(department);
    const profileLanguage = get(languageNames.find(item => item.languageCode === language), 'languageName')
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
                withCall={withCall}
                onClickToCall={() => this.handleClickToCall(phone)}
                value={isPhoneHidden ? hideText(phone) : phone}
                className="Personal__contacts"
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
  }
}

export default compose(
  withRequests({
    clickToCall: ClickToCallMutation,
  }),
  withNotifications,
  withStorage(['auth']),
)(Personal);
