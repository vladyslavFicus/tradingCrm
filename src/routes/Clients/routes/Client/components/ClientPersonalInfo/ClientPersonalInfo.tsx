import React, { useState } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import Trackify from '@hrzn/trackify';
import { UncontrolledTooltip } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { FormikSwitchField } from 'components/Formik';
import { getBrand } from 'config';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import {
  ClickToCall__Phone__Type__Enum as PhoneType,
  ClickToCall__Customer__Type__Enum as CustomerType,
  Profile,
} from '__generated__/types';
import { Button } from 'components/Buttons';
import Uuid from 'components/Uuid';
import CopyToClipboard from 'components/CopyToClipboard';
import Click2Call from 'components/Click2Call';
import Sms from 'components/Sms';
import { PersonalInformationItem } from 'components/Information';
import SendEmailModal, { SendEmailModalProps } from 'modals/SendEmailModal';
import { useProfilePhonesQueryLazyQuery } from './graphql/__generated__/ProfilePhonesQuery';
import { useProfileEmailQueryLazyQuery } from './graphql/__generated__/ProfileEmailQuery';
import { useProfileAdditionalEmailQueryLazyQuery } from './graphql/__generated__/ProfileAdditionalEmailQuery';
import { useUpdateConfigurationMutation } from './graphql/__generated__/UpdateConfigurationMutation';
import './ClientPersonalInfo.scss';

type Configuration = {
  crs: boolean,
  fatca: boolean,
};

type State = {
  phone?: string,
  email?: string,
  additionalPhone?: string,
  additionalEmail?: string,
};

type Props = {
  profile: Profile,
};

const ClientPersonalInfo = (props: Props) => {
  const { profile } = props;

  const {
    uuid: playerUUID,
    firstName,
    lastName,
    birthDate,
    gender,
    convertedFromLeadUuid,
    migrationId,
    contacts,
    address: {
      countryCode,
      city,
      address: fullAddress,
    },
    phoneVerified,
    configuration: {
      crs,
      fatca,
    },
    affiliate,
    clientType,
    referrer,
    localTime,
  } = profile;

  const [state, setState] = useState<State>({});

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowAffiliateUuid = permission.allows(permissions.USER_PROFILE.AFFILIATE_FIELD_UUID);
  const allowAffiliateSource = permission.allows(permissions.USER_PROFILE.AFFILIATE_FIELD_SOURCE);
  const allowAffiliateReferral = permission.allows(permissions.USER_PROFILE.AFFILIATE_FIELD_REFERRAL);
  const allowAffiliateCampaignId = permission.allows(permissions.USER_PROFILE.AFFILIATE_FIELD_CAMPAIGN_ID);
  const allowAffiliateSms = permission.allows(permissions.USER_PROFILE.AFFILIATE_FIELD_SMS);
  const allowConvertedFromLeadUuid = permission.allows(permissions.USER_PROFILE.FIELD_CONVERTED_FROM_LEAD_UUID);
  const allowChangeConfiguration = permission.allows(permissions.USER_PROFILE.CHANGE_CONFIGURATION);
  const allowSendEmail = permission.allows(permissions.EMAIL_TEMPLATES.SEND_EMAIL) && getBrand().email.templatedEmails;
  const allowShowEmail = permission.allows(permissions.USER_PROFILE.FIELD_EMAIL);
  const allowShowAdditionalEmail = permission.allows(permissions.USER_PROFILE.FIELD_ADDITIONAL_EMAIL);
  const allowShowPhones = permission.allowsAny([
    permissions.USER_PROFILE.FIELD_ADDITIONAL_PHONE,
    permissions.USER_PROFILE.FIELD_PHONE,
  ]);

  // ===== Modals ===== //
  const sendEmailModal = useModal<SendEmailModalProps>(SendEmailModal);

  // ===== Requests ===== //
  const [profilePhonesQuery] = useProfilePhonesQueryLazyQuery({ fetchPolicy: 'network-only' });
  const [profileEmailQuery] = useProfileEmailQueryLazyQuery({ fetchPolicy: 'network-only' });
  const [profileAdditionalEmailQuery] = useProfileAdditionalEmailQueryLazyQuery({ fetchPolicy: 'network-only' });
  const [updateConfigurationMutation] = useUpdateConfigurationMutation();

  // ===== Handlers ===== //
  const handleRegulatedChanged = async (variables: Configuration) => {
    try {
      await updateConfigurationMutation({
        variables: {
          playerUUID,
          ...variables,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.ACTIONS.UPDATED'),
        message: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ACTIONS.UPDATED'),
        message: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
      });
    }
  };

  const handleReferrerClick = () => {
    if (profile?.referrer?.uuid) {
      window.open(`/clients/${profile.referrer.uuid}/profile`, '_blank');
    }
  };

  const handleOpenSendEmailModal = () => {
    sendEmailModal.show({
      uuid: playerUUID,
      field: 'contacts.email',
      type: 'PROFILE',
      clientInfo: { firstName, lastName },
    });
  };

  const getProfilePhones = async () => {
    try {
      const { data } = await profilePhonesQuery({ variables: { playerUUID } });
      const phone = data?.profileContacts?.phone || undefined;
      const additionalPhone = data?.profileContacts?.additionalPhone || undefined;

      Trackify.click('PROFILE_PHONES_VIEWED', { eventLabel: playerUUID });
      setState({ ...state, phone, additionalPhone });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const getProfileEmail = async () => {
    try {
      const { data } = await profileEmailQuery({ variables: { playerUUID } });
      const email = data?.profileContacts?.email || undefined;

      Trackify.click('PROFILE_EMAILS_VIEWED', { eventLabel: playerUUID });

      setState({ ...state, email });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const getProfileAdditionalEmail = async () => {
    try {
      const { data } = await profileAdditionalEmailQuery({ variables: { playerUUID } });
      const additionalEmail = data?.profileContacts?.additionalEmail || undefined;

      Trackify.click('PROFILE_EMAILS_VIEWED', { eventLabel: playerUUID });

      setState({ ...state, additionalEmail });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  // ===== Renders ===== //
  const renderAffiliate = () => {
    if (!affiliate) {
      return null;
    }

    return (
      <>
        <If condition={!!affiliate.partner}>
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.AFFILIATE')}
            value={affiliate.partner?.fullName}
          />
        </If>

        <If condition={allowAffiliateUuid}>
          <strong>{I18n.t('CLIENT_PROFILE.DETAILS.AFFILIATE_ID')}</strong>: <Uuid uuid={affiliate.uuid || ''} />
        </If>

        <If condition={allowAffiliateSource}>
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.SOURCE')}
            value={(
              <>
                <CopyToClipboard
                  text={affiliate.source || ''}
                  withNotification
                  notificationLevel={LevelType.INFO}
                  notificationTitle="COMMON.NOTIFICATIONS.COPIED"
                  notificationMessage="COMMON.NOTIFICATIONS.CLIPPED_VALUE_MESSAGE"
                >
                  <span id="source-tooltip">
                    {affiliate.source}
                  </span>
                </CopyToClipboard>

                <UncontrolledTooltip
                  placement="top-start"
                  target="source-tooltip"
                  delay={{ show: 350, hide: 250 }}
                  fade={false}
                >
                  {affiliate.source}
                </UncontrolledTooltip>
              </>
            )}
          />
        </If>

        <If condition={allowAffiliateReferral}>
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.REFERRAL')}
            value={(
              <>
                <CopyToClipboard
                  text={affiliate.referral || ''}
                  withNotification
                  notificationLevel={LevelType.INFO}
                  notificationTitle="COMMON.NOTIFICATIONS.COPIED"
                  notificationMessage="COMMON.NOTIFICATIONS.CLIPPED_VALUE_MESSAGE"
                >
                  <span
                    id="refferal-tooltip"
                  >
                    {affiliate.referral}
                  </span>
                </CopyToClipboard>

                <UncontrolledTooltip
                  placement="top-start"
                  target="refferal-tooltip"
                  delay={{ show: 350, hide: 250 }}
                  fade={false}
                >
                  {affiliate.referral}
                </UncontrolledTooltip>
              </>
            )}
          />
        </If>

        <If condition={allowAffiliateCampaignId}>
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.CAMPAIGN_ID')}
            value={(
              <>
                <CopyToClipboard
                  text={affiliate.campaignId || ''}
                  withNotification
                  notificationLevel={LevelType.INFO}
                  notificationTitle="COMMON.NOTIFICATIONS.COPIED"
                  notificationMessage="COMMON.NOTIFICATIONS.CLIPPED_VALUE_MESSAGE"
                >
                  <span
                    id="campaignId-tooltip"
                  >
                    {affiliate.campaignId}
                  </span>
                </CopyToClipboard>

                <UncontrolledTooltip
                  placement="top-start"
                  target="campaignId-tooltip"
                  delay={{ show: 350, hide: 250 }}
                  fade={false}
                >
                  {affiliate.campaignId}
                </UncontrolledTooltip>
              </>
            )}
          />
        </If>

        <If condition={allowAffiliateSms}>
          <PersonalInformationItem
            label="SMS"
            value={affiliate.sms}
          />
        </If>
      </>
    );
  };

  return (
    <div className="ClientPersonalInfo">
      <div className="ClientPersonalInfo__title">
        {I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}
      </div>

      <div className="ClientPersonalInfo__content">
        <If condition={!!clientType}>
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.CLIENT_TYPE')}
            value={I18n.t(`CLIENT_PROFILE.DETAILS.${clientType}`)}
          />
        </If>

        <PersonalInformationItem
          label={I18n.t('CLIENT_PROFILE.DETAILS.DATE_OF_BIRTH')}
          value={birthDate ? moment(birthDate).format('DD.MM.YYYY') : null}
        />

        <PersonalInformationItem
          label={I18n.t('CLIENT_PROFILE.DETAILS.GENDER')}
          value={gender}
        />

        <PersonalInformationItem
          label={I18n.t('CLIENT_PROFILE.DETAILS.PHONE')}
          value={state.phone || contacts.phone}
          verified={phoneVerified}
          additional={(
            <>
              <If condition={allowShowPhones}>
                <Button
                  tertiary
                  className="ClientPersonalInfo__show-contacts-button"
                  data-testid="ClientPersonalInfo-showPhonesButton"
                  onClick={getProfilePhones}
                >
                  {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.SHOW')}
                </Button>
              </If>

              <Sms uuid={playerUUID} field="contacts.phone" type="PROFILE" />

              <Click2Call
                uuid={playerUUID}
                phoneType={PhoneType.PHONE}
                customerType={CustomerType.PROFILE}
              />
            </>
          )}
          className="ClientPersonalInfo__contacts"
        />

        <PersonalInformationItem
          label={I18n.t('CLIENT_PROFILE.DETAILS.ALT_PHONE')}
          value={state.additionalPhone || contacts.additionalPhone}
          additional={(
            <>
              <Sms uuid={playerUUID} field="contacts.additionalPhone" type="PROFILE" />

              <Click2Call
                uuid={playerUUID}
                phoneType={PhoneType.ADDITIONAL_PHONE}
                customerType={CustomerType.PROFILE}
              />
            </>
          )}
          className="ClientPersonalInfo__contacts"
        />

        <PersonalInformationItem
          label={I18n.t('CLIENT_PROFILE.DETAILS.EMAIL')}
          value={state.email || contacts.email}
          additional={(
            <If condition={allowShowEmail}>
              <Button
                tertiary
                className="ClientPersonalInfo__show-contacts-button"
                data-testid="ClientPersonalInfo-showEmailButton"
                onClick={getProfileEmail}
              >
                {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.SHOW')}
              </Button>
            </If>
          )}
          onClickSelectEmail={handleOpenSendEmailModal}
          withSendEmail={allowSendEmail}
          className="ClientPersonalInfo__contacts"
        />

        <PersonalInformationItem
          label={I18n.t('CLIENT_PROFILE.DETAILS.ALT_EMAIL')}
          value={state.additionalEmail || contacts.additionalEmail}
          additional={(
            <If condition={allowShowAdditionalEmail}>
              <Button
                tertiary
                className="ClientPersonalInfo__show-contacts-button"
                data-testid="ClientPersonalInfo-showAdditionalEmailButton"
                onClick={getProfileAdditionalEmail}
              >
                {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.SHOW')}
              </Button>
            </If>
          )}
          className="ClientPersonalInfo__contacts"
        />

        <PersonalInformationItem
          label={I18n.t('CLIENT_PROFILE.DETAILS.FULL_ADDRESS')}
          value={fullAddress}
        />

        <PersonalInformationItem
          label={I18n.t('CLIENT_PROFILE.DETAILS.COUNTRY')}
          value={countryCode}
        />

        <PersonalInformationItem
          label={I18n.t('CLIENT_PROFILE.DETAILS.CITY')}
          value={city}
        />

        {renderAffiliate()}

        <PersonalInformationItem
          label={I18n.t('CLIENT_PROFILE.DETAILS.LOCAL_TIME')}
          value={localTime}
        />

        <If condition={allowConvertedFromLeadUuid && !!convertedFromLeadUuid}>
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.CONVERTED_FROM_LEAD')}
            value={<Uuid uuid={`${convertedFromLeadUuid}`} />}
          />
        </If>

        <If condition={!!migrationId}>
          <>
            <strong>{I18n.t('CLIENT_PROFILE.DETAILS.MIGRATION_ID')}</strong>
            {': '}
            <Uuid uuid={`${migrationId}`} />
          </>
        </If>

        <If condition={allowChangeConfiguration}>
          <Formik
            enableReinitialize
            initialValues={{ fatca: !!fatca, crs: !!crs }}
            onSubmit={handleRegulatedChanged}
          >
            {({ submitForm }) => (
              <Form>
                <Field
                  name="fatca"
                  data-testid="ClientPersonalInfo-fatcaSwitch"
                  label={I18n.t('CLIENT_PROFILE.FATCA.TITLE')}
                  component={FormikSwitchField}
                  onChange={submitForm}
                />

                <Field
                  name="crs"
                  data-testid="ClientPersonalInfo-crsSwitch"
                  label={I18n.t('CLIENT_PROFILE.CRS.TITLE')}
                  component={FormikSwitchField}
                  onChange={submitForm}
                />
              </Form>
            )}
          </Formik>
        </If>

        <If condition={!!referrer?.fullName}>
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.REFERRER')}
            value={referrer?.fullName}
            onClickValue={handleReferrerClick}
          />
        </If>
      </div>
    </div>
  );
};

export default React.memo(ClientPersonalInfo);
