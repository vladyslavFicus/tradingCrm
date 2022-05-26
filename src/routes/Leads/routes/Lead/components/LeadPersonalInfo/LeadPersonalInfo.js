import React, { PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withApollo } from '@apollo/client/react/hoc';
import Trackify from '@hrzn/trackify';
import Flag from 'react-country-flag';
import { withNotifications } from 'hoc';
import {
  ClickToCall__Phone__Type__Enum as PhoneType,
  ClickToCall__Customer__Type__Enum as CustomerType,
} from '__generated__/types';
import permissions from 'config/permissions';
import { CONDITIONS } from 'utils/permissions';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import PropTypes from 'constants/propTypes';
import Click2Call from 'components/Click2Call';
import { PersonalInformationItem } from 'components/Information';
import countryList, { getCountryCode } from 'utils/countryList';
import LeadPhonesQuery from '../../graphql/LeadPhonesQuery';
import LeadEmailQuery from '../../graphql/LeadEmailQuery';
import './LeadPersonalInfo.scss';

class LeadPersonalInfo extends PureComponent {
  static propTypes = {
    lead: PropTypes.lead.isRequired,
    notify: PropTypes.func.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    email: undefined,
    phone: undefined,
    mobile: undefined,
  };

  getLeadPhones = async () => {
    const { lead: { uuid }, notify } = this.props;

    try {
      const { data: { leadContacts: { phone, mobile } } } = await this.props.client.query({
        query: LeadPhonesQuery,
        variables: { uuid },
      });

      Trackify.click('LEAD_PHONES_VIEWED', { eventLabel: uuid });

      this.setState({ phone, mobile });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  getLeadEmail = async () => {
    const { lead: { uuid }, notify } = this.props;

    try {
      const { data: { leadContacts: { email } } } = await this.props.client.query({
        query: LeadEmailQuery,
        variables: { uuid },
        fetchPolicy: 'network-only',
      });

      Trackify.click('LEAD_EMAILS_VIEWED', { eventLabel: uuid });

      this.setState({ email });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

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
            value={this.state.phone || phone}
            additional={(
              <>
                <PermissionContent
                  permissions={[permissions.LEAD_PROFILE.FIELD_PHONE, permissions.LEAD_PROFILE.FIELD_MOBILE]}
                  permissionsCondition={CONDITIONS.OR}
                >
                  <Button
                    className="LeadPersonalInfo__show-contacts-button"
                    onClick={this.getLeadPhones}
                  >
                    {I18n.t('COMMON.BUTTONS.SHOW')}
                  </Button>
                </PermissionContent>
                <Click2Call uuid={uuid} phoneType={PhoneType.PHONE} customerType={CustomerType.LEAD} />
              </>
            )}
            className="LeadPersonalInfo__phone"
          />
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.MOBILE')}
            value={this.state.mobile || mobile}
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
            value={this.state.email || email}
            additional={(
              <PermissionContent permissions={[permissions.LEAD_PROFILE.FIELD_EMAIL]}>
                <Button
                  className="LeadPersonalInfo__show-contacts-button"
                  onClick={this.getLeadEmail}
                >
                  {I18n.t('COMMON.BUTTONS.SHOW')}
                </Button>
              </PermissionContent>
            )}
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

export default compose(
  withApollo,
  withNotifications,
)(LeadPersonalInfo);
