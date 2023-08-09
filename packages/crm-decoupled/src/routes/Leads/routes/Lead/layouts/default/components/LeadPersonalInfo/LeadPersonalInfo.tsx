import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import Flag from 'react-country-flag';
import { Utils } from '@crm/common';
import { Button } from 'components';
import {
  ClickToCall__Phone__Type__Enum as PhoneType,
  ClickToCall__Customer__Type__Enum as CustomerType,
  Lead,
} from '__generated__/types';
import Uuid from 'components/Uuid';
import Click2Call from 'components/Click2Call';
import { PersonalInformationItem } from 'components/Information';
import useLeadPersonalInfo from 'routes/Leads/routes/Lead/hooks/useLeadPersonalInfo';
import './LeadPersonalInfo.scss';

type Props = {
  lead: Lead,
};

const LeadPersonalInfo = (props: Props) => {
  const { lead } = props;
  const {
    uuid,
    birthDate,
    gender,
    city,
    language,
    source,
    affiliate,
    affiliateUuid,
    convertedToClientUuid,
    statusChangedDate,
  } = lead;

  const {
    countryCode,
    state,
    allowShowEmail,
    allowShowPhones,
    handleGetLeadPhones,
    handleGetLeadEmail,
  } = useLeadPersonalInfo(props);

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
              <When condition={!!birthDate}>
                {moment.utc(birthDate || '').local().format('DD.MM.YYYY')}
              </When>

              <Otherwise>
                &mdash;
              </Otherwise>
            </Choose>
          )}
        />

        <PersonalInformationItem
          label={I18n.t('LEAD_PROFILE.DETAILS.GENDER')}
          value={gender}
        />

        <PersonalInformationItem
          className="LeadPersonalInfo__phone"
          label={I18n.t('LEAD_PROFILE.DETAILS.PHONE')}
          value={state.phone || lead.phone}
          additional={(
            <>
              <If condition={allowShowPhones}>
                <Button
                  tertiary
                  className="LeadPersonalInfo__show-contacts-button"
                  data-testid="LeadPersonalInfo-showPhoneButton"
                  onClick={handleGetLeadPhones}
                >
                  {I18n.t('COMMON.BUTTONS.SHOW')}
                </Button>
              </If>

              <Click2Call uuid={uuid} phoneType={PhoneType.PHONE} customerType={CustomerType.LEAD} />
            </>
          )}
        />

        <PersonalInformationItem
          className="LeadPersonalInfo__phone"
          label={I18n.t('LEAD_PROFILE.DETAILS.MOBILE')}
          value={state.mobile || lead.mobile}
          additional={(
            <Click2Call
              uuid={uuid}
              phoneType={PhoneType.ADDITIONAL_PHONE}
              customerType={CustomerType.LEAD}
            />
          )}
        />

        <PersonalInformationItem
          label={I18n.t('LEAD_PROFILE.DETAILS.EMAIL')}
          value={state.email || lead.email}
          additional={(
            <If condition={allowShowEmail}>
              <Button
                tertiary
                className="LeadPersonalInfo__show-contacts-button"
                data-testid="LeadPersonalInfo-showEmailButton"
                onClick={handleGetLeadEmail}
              >
                {I18n.t('COMMON.BUTTONS.SHOW')}
              </Button>
            </If>
          )}
        />

        <PersonalInformationItem
          className="LeadPersonalInfo__country"
          label={I18n.t('LEAD_PROFILE.DETAILS.COUNTRY')}
          value={(
            <Choose>
              <When condition={!!countryCode}>
                <Flag style={{ height: 10 }} countryCode={countryCode} svg />
                {' '}
                {Utils.countryList[countryCode]}
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

        <If condition={!!language}>
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.LANGUAGE')}
            value={I18n.t(`COMMON.LANGUAGE_NAME.${`${language}`.toUpperCase()}`, {
              defaultValue: `${language}`.toUpperCase(),
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

        <PersonalInformationItem
          label={I18n.t('LEAD_PROFILE.DETAILS.AFFILIATE_UUID')}
          value={affiliateUuid}
        />

        <If condition={!!convertedToClientUuid}>
          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.CONVERTED_TO_CLIENT')}
            value={<Uuid uuid={convertedToClientUuid || ''} />}
          />

          <PersonalInformationItem
            label={I18n.t('LEAD_PROFILE.DETAILS.CONVERTED_SINCE')}
            value={moment.utc(statusChangedDate || '').local().format('DD.MM.YYYY HH:mm:ss')}
          />
        </If>
      </div>
    </div>
  );
};

export default React.memo(LeadPersonalInfo);
