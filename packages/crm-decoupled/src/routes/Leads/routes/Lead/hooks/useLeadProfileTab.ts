import { useState, useCallback } from 'react';
import I18n from 'i18n-js';
import Trackify from '@hrzn/trackify';
import { parseErrors } from 'apollo';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useLeadEmailQueryLazyQuery } from '../graphql/__generated__/LeadEmailQuery';
import { useLeadMobileQueryLazyQuery } from '../graphql/__generated__/LeadMobileQuery';
import { useLeadPhoneQueryLazyQuery } from '../graphql/__generated__/LeadPhoneQuery';
import { useUpdateLeadMutation } from '../graphql/__generated__/UpdateLeadMutation';

type FormValues = {
  name: string,
  surname: string,
  birthDate: string,
  gender: string,
  country: string,
  city: string,
  phone: string,
  mobile: string,
  email: string,
};

type State = {
  email?: string,
  phone?: string,
  mobile?: string,
  isPhoneShown: boolean,
  isMobileShown: boolean,
  isEmailShown: boolean,
};

type Props = {
  uuid: string,
  onRefetch: () => void,
};

const useLeadProfileTab = (props: Props) => {
  const { uuid, onRefetch } = props;

  const [state, setState] = useState<State>({ isPhoneShown: false, isMobileShown: false, isEmailShown: false });
  const { isPhoneShown, isMobileShown, isEmailShown } = state;

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowEmailField = permission.allows(permissions.LEAD_PROFILE.FIELD_EMAIL);
  const allowPhoneField = permission.allows(permissions.LEAD_PROFILE.FIELD_PHONE);
  const allowMobileField = permission.allows(permissions.LEAD_PROFILE.FIELD_MOBILE);

  // ===== Requests ===== //
  const [leadEmailQuery] = useLeadEmailQueryLazyQuery({ fetchPolicy: 'network-only' });
  const [leadMobileQuery] = useLeadMobileQueryLazyQuery({ fetchPolicy: 'network-only' });
  const [leadPhoneQuery] = useLeadPhoneQueryLazyQuery({ fetchPolicy: 'network-only' });
  const [updateLeadMutation] = useUpdateLeadMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async (values: FormValues) => {
    const phone = (isPhoneShown && values.phone) ? values.phone : null;
    const mobile = (isMobileShown && values.mobile !== null) ? values.mobile : null;
    const email = (isEmailShown && values.email) ? values.email : null;

    try {
      await updateLeadMutation({
        variables: {
          uuid,
          ...values,
          phone,
          mobile,
          email,
          country: values?.country || null,
        },
      });

      await onRefetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('LEAD_PROFILE.UPDATED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('LEAD_PROFILE.NOTIFICATION_FAILURE'),
        message: error.error === 'error.entity.already.exist'
          ? I18n.t('lead.error.entity.already.exist', { email: values.email })
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [uuid, isPhoneShown, isMobileShown, isEmailShown]);

  const handleGetLeadEmail = useCallback(async () => {
    try {
      const { data } = await leadEmailQuery({ variables: { uuid } });
      const email = data?.leadContacts.email;

      Trackify.click('LEAD_EMAILS_VIEWED', { eventLabel: uuid });

      setState({ ...state, email, isEmailShown: true });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [uuid, state]);

  const handleGetLeadMobile = useCallback(async () => {
    try {
      const { data } = await leadMobileQuery({ variables: { uuid } });
      const mobile = data?.leadContacts.mobile || undefined;

      Trackify.click('LEAD_PHONES_VIEWED', { eventLabel: uuid });

      setState({ ...state, mobile, isMobileShown: true });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [uuid, state]);

  const handleGetLeadPhone = useCallback(async () => {
    try {
      const { data } = await leadPhoneQuery({ variables: { uuid } });
      const phone = data?.leadContacts.phone;

      Trackify.click('LEAD_PHONES_VIEWED', { eventLabel: uuid });

      setState({ ...state, phone, isPhoneShown: true });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [uuid, state]);

  return {
    state,
    isEmailShown,
    isPhoneShown,
    isMobileShown,
    allowEmailField,
    allowPhoneField,
    allowMobileField,
    handleSubmit,
    handleGetLeadEmail,
    handleGetLeadMobile,
    handleGetLeadPhone,
  };
};

export default useLeadProfileTab;
