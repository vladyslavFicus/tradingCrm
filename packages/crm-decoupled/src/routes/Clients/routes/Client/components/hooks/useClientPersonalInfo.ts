import { useCallback, useState } from 'react';
import Trackify from '@hrzn/trackify';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import SendEmailModal, { SendEmailModalProps } from 'modals/SendEmailModal';
import { Profile__Referrer as ProfileReferrer } from '__generated__/types';
import { useProfilePhonesQueryLazyQuery } from '../graphql/__generated__/ProfilePhonesQuery';
import { useProfileEmailQueryLazyQuery } from '../graphql/__generated__/ProfileEmailQuery';
import { useProfileAdditionalEmailQueryLazyQuery } from '../graphql/__generated__/ProfileAdditionalEmailQuery';
import { useUpdateConfigurationMutation } from '../graphql/__generated__/UpdateConfigurationMutation';
import { Configuration, State } from '../types/clientPersonalInfo';

type Props = {
  firstName: string,
  lastName: string,
  playerUUID: string,
  referrer?: ProfileReferrer | null,
};

type UseClientPersonalInfo = {
  state: State,
  allowAffiliateUuid: boolean,
  allowAffiliateSource: boolean,
  allowAffiliateReferral: boolean,
  allowAffiliateCampaignId: boolean,
  allowAffiliateSms: boolean,
  allowConvertedFromLeadUuid: boolean,
  allowChangeConfiguration: boolean,
  allowSendEmail: boolean,
  allowShowEmail: boolean,
  allowShowAdditionalEmail: boolean,
  allowShowPhones: boolean,
  getProfilePhones: () => void,
  getProfileEmail: () => void,
  handleOpenSendEmailModal: () => void,
  handleRegulatedChanged: (variables: Configuration) => void,
  getProfileAdditionalEmail: () => void,
  handleReferrerClick: () => void,
};

const useClientPersonalInfo = (props: Props): UseClientPersonalInfo => {
  const { firstName, lastName, referrer, playerUUID } = props;
  const referrerUUID = referrer?.uuid;
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
  const handleRegulatedChanged = useCallback(async (variables: Configuration) => {
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
  }, [playerUUID, updateConfigurationMutation]);

  const handleReferrerClick = useCallback(() => {
    if (referrerUUID) {
      window.open(`/clients/${referrerUUID}`, '_blank');
    }
  }, [referrerUUID]);

  const handleOpenSendEmailModal = useCallback(() => {
    sendEmailModal.show({
      uuid: playerUUID,
      field: 'contacts.email',
      type: 'PROFILE',
      clientInfo: { firstName, lastName },
    });
  }, [firstName, lastName, playerUUID, sendEmailModal]);

  const getProfilePhones = useCallback(async () => {
    try {
      const { data } = await profilePhonesQuery({ variables: { playerUUID } });
      const phone = data?.profileContacts?.phone || '';
      const additionalPhone = data?.profileContacts?.additionalPhone || '';

      Trackify.click('PROFILE_PHONES_VIEWED', { eventLabel: playerUUID });
      setState({ ...state, phone, additionalPhone });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [playerUUID, profilePhonesQuery, state]);

  const getProfileEmail = useCallback(async () => {
    try {
      const { data } = await profileEmailQuery({ variables: { playerUUID } });
      const email = data?.profileContacts?.email || '';

      Trackify.click('PROFILE_EMAILS_VIEWED', { eventLabel: playerUUID });

      setState({ ...state, email });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [playerUUID, profileEmailQuery, state]);

  const getProfileAdditionalEmail = useCallback(async () => {
    try {
      const { data } = await profileAdditionalEmailQuery({ variables: { playerUUID } });
      const additionalEmail = data?.profileContacts?.additionalEmail || '';

      Trackify.click('PROFILE_EMAILS_VIEWED', { eventLabel: playerUUID });

      setState({ ...state, additionalEmail });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [playerUUID, profileAdditionalEmailQuery, state]);

  return {
    state,
    allowAffiliateUuid,
    allowAffiliateSource,
    allowAffiliateReferral,
    allowAffiliateCampaignId,
    allowAffiliateSms,
    allowConvertedFromLeadUuid,
    allowChangeConfiguration,
    allowSendEmail,
    allowShowEmail,
    allowShowAdditionalEmail,
    allowShowPhones,
    getProfilePhones,
    getProfileEmail,
    handleOpenSendEmailModal,
    handleRegulatedChanged,
    getProfileAdditionalEmail,
    handleReferrerClick,
  };
};

export default useClientPersonalInfo;
