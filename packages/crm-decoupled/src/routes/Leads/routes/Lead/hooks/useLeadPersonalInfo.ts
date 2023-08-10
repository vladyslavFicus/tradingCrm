import { useState, useCallback } from 'react';
import I18n from 'i18n-js';
import Trackify from '@hrzn/trackify';
import { Config, Utils, usePermission, notify, LevelType } from '@crm/common';
import { Lead } from '__generated__/types';
import { useLeadPhonesQueryLazyQuery } from '../graphql/__generated__/LeadPhonesQuery';
import { useLeadEmailQueryLazyQuery } from '../graphql/__generated__/LeadEmailQuery';

type State = {
  email?: string,
  phone?: string,
  mobile?: string,
};

type Props = {
  lead: Lead,
};

const useLeadPersonalInfo = (props: Props) => {
  const { lead } = props;
  const {
    uuid,
    country,
  } = lead;

  const countryCode = Utils.getCountryCode(country || '') || '';

  const [state, setState] = useState<State>({});

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowShowEmail = permission.allows(Config.permissions.LEAD_PROFILE.FIELD_EMAIL);
  const allowShowPhones = permission.allowsAny([
    Config.permissions.LEAD_PROFILE.FIELD_PHONE,
    Config.permissions.LEAD_PROFILE.FIELD_MOBILE,
  ]);

  // ===== Requests ===== //
  const [leadEmailQuery] = useLeadEmailQueryLazyQuery({ fetchPolicy: 'network-only' });
  const [leadPhonesQuery] = useLeadPhonesQueryLazyQuery({ fetchPolicy: 'network-only' });

  // ===== Handlers ===== //
  const handleGetLeadPhones = useCallback(async () => {
    try {
      const { data } = await leadPhonesQuery({ variables: { uuid } });
      const phone = data?.leadContacts.phone;
      const mobile = data?.leadContacts.mobile || undefined;

      Trackify.click('LEAD_PHONES_VIEWED', { eventLabel: uuid });

      setState({ ...state, phone, mobile });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [uuid, state]);

  const handleGetLeadEmail = useCallback(async () => {
    try {
      const { data } = await leadEmailQuery({ variables: { uuid } });
      const email = data?.leadContacts.email;

      Trackify.click('LEAD_EMAILS_VIEWED', { eventLabel: uuid });

      setState({ ...state, email });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [uuid, state]);

  return {
    countryCode,
    state,
    allowShowEmail,
    allowShowPhones,
    handleGetLeadPhones,
    handleGetLeadEmail,
  };
};

export default useLeadPersonalInfo;
