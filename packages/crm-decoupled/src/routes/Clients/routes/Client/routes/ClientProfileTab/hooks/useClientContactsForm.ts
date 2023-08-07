import { useCallback, useState } from 'react';
import Trackify from '@hrzn/trackify';
import I18n from 'i18n-js';
import { FormikHelpers } from 'formik';
import { permissions } from 'config';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { Permission } from 'types/permissions';
import { useProfilePhonesQueryLazyQuery } from '../graphql/__generated__/ProfilePhonesQuery';
import { useUpdateClientContactsMutation } from '../graphql/__generated__/UpdateClientContactsMutation';
import { useUpdateClientEmailMutation } from '../graphql/__generated__/UpdateClientEmailMutation';
import { useVerifyEmailMutation } from '../graphql/__generated__/VerifyEmailMutation';
import { useVerifyPhoneMutation } from '../graphql/__generated__/VerifyPhoneMutation';
import { useProfileEmailQueryLazyQuery } from '../graphql/__generated__/ProfileEmailQuery';
import { useProfileAdditionalEmailQueryLazyQuery } from '../graphql/__generated__/ProfileAdditionalEmailQuery';
import { FormValues } from '../types/clientContactsForm';

type Props = {
  uuid: string,
};

type UseClientContactsForm = {
  profileContacts: FormValues,
  isAvailableToUpdateContacts: boolean,
  isAvailableToSeePhone: boolean,
  isAvailableToSeeAltPhone: boolean,
  isAvailableToSeeAltEmail: boolean,
  isPhonesShown: boolean,
  permission: Permission,
  isAvailableToUpdateEmail: boolean,
  isAvailableToSeeEmail: boolean,
  isEmailShown: boolean,
  isAdditionalEmailShown: boolean,
  getProfileEmail: () => void,
  getProfilePhones: () => void,
  handleVerifyPhone: () => void,
  handleVerifyEmail: () => void,
  getProfileAdditionalEmail: () => void,
  handleSubmitContacts: (values: FormValues) => void,
  handleSubmitEmailClick: (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => void,
};

const useClientContactsForm = (props: Props): UseClientContactsForm => {
  const { uuid } = props;
  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const [isPhonesShown, setIsPhonesShown] = useState<boolean>(false);
  const [isEmailShown, setIsEmailShown] = useState<boolean>(false);
  const [isAdditionalEmailShown, setIsAdditionalEmailShown] = useState<boolean>(false);
  const [profileContacts, setProfileContacts] = useState<FormValues>({
    email: null,
    phone: null,
    additionalEmail: null,
    additionalPhone: null,
  });

  // ===== Permissions ===== //
  const permission = usePermission();
  const isAvailableToSeePhone = permission.allows(permissions.USER_PROFILE.FIELD_PHONE);
  const isAvailableToSeeAltPhone = permission.allows(permissions.USER_PROFILE.FIELD_ADDITIONAL_PHONE);
  const isAvailableToSeeAltEmail = permission.allows(permissions.USER_PROFILE.FIELD_ADDITIONAL_EMAIL);
  const isAvailableToSeeEmail = permission.allows(permissions.USER_PROFILE.FIELD_EMAIL);
  const isAvailableToUpdateContacts = permission.allows(permissions.USER_PROFILE.UPDATE_CONTACTS);
  const isAvailableToUpdateEmail = permission.allows(permissions.USER_PROFILE.UPDATE_EMAIL);

  // ===== Requests ===== //
  const [profilePhonesQuery] = useProfilePhonesQueryLazyQuery();
  const [profileEmailQuery] = useProfileEmailQueryLazyQuery();
  const [profileAdditionalEmailQuery] = useProfileAdditionalEmailQueryLazyQuery();

  const [updateClientContacts] = useUpdateClientContactsMutation();
  const [updateClientEmail] = useUpdateClientEmailMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [verifyPhone] = useVerifyPhoneMutation();

  const getProfilePhones = useCallback(async () => {
    try {
      const { data } = await profilePhonesQuery({ variables: { playerUUID: uuid } });

      Trackify.click('PROFILE_PHONES_VIEWED', {
        eventLabel: uuid,
      });

      setProfileContacts({
        ...profileContacts,
        phone: data?.profileContacts?.phone || null,
        additionalPhone: data?.profileContacts?.additionalPhone || null,
      });

      setIsPhonesShown(true);
    } catch {
      // do nothing...
    }
  }, [profileContacts, profilePhonesQuery, uuid]);

  const getProfileEmail = useCallback(async () => {
    try {
      const { data } = await profileEmailQuery({ variables: { playerUUID: uuid } });

      Trackify.click('PROFILE_EMAILS_VIEWED', {
        eventLabel: uuid,
      });

      setProfileContacts({
        ...profileContacts,
        email: data?.profileContacts?.email || null,
      });

      setIsEmailShown(true);
    } catch {
      // do nothing...
    }
  }, [profileContacts, profileEmailQuery, uuid]);

  const getProfileAdditionalEmail = useCallback(async () => {
    try {
      const { data } = await profileAdditionalEmailQuery({ variables: { playerUUID: uuid } });

      Trackify.click('PROFILE_EMAILS_VIEWED', {
        eventLabel: uuid,
      });

      setProfileContacts({
        ...profileContacts,
        additionalEmail: data?.profileContacts?.additionalEmail || null,
      });

      setIsAdditionalEmailShown(true);
    } catch {
    // do nothing...
    }
  }, [profileAdditionalEmailQuery, profileContacts, uuid]);

  // ===== Handlers ===== //
  const handleSubmitContacts = useCallback(async (values: FormValues) => {
    try {
      await updateClientContacts({
        variables: {
          playerUUID: uuid,
          phone: isPhonesShown ? (values.phone || profileContacts.phone) : null,
          additionalPhone: isPhonesShown ? (values.additionalPhone || profileContacts.additionalPhone) : null,
          additionalEmail: isAdditionalEmailShown ? (values.additionalEmail || profileContacts.additionalEmail) : null,
        },
      });

      setProfileContacts({
        ...profileContacts,
        additionalEmail: isAdditionalEmailShown ? (values.additionalEmail || profileContacts.additionalEmail) : null,
        additionalPhone: isPhonesShown ? (values.additionalPhone || profileContacts.additionalPhone) : null,
        phone: isPhonesShown ? (values.phone || profileContacts.phone) : null,
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const { error } = parseErrors(e);

      switch (error) {
        case 'error.phone.already.exist': {
          notify({
            level: LevelType.ERROR,
            title: I18n.t('COMMON.PHONE'),
            message: I18n.t('error.validation.phone.exists'),
          });

          break;
        }

        default: {
          notify({
            level: LevelType.ERROR,
            title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
            message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
          });
        }
      }
    }
  }, [isAdditionalEmailShown, isPhonesShown, profileContacts, updateClientContacts, uuid]);

  const handleSubmitEmail = async (values: FormValues) => {
    try {
      await updateClientEmail({
        variables: {
          playerUUID: uuid,
          email: values.email,
        },
      });

      setProfileContacts({ ...profileContacts, email: values.email });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const { error } = parseErrors(e);

      switch (error) {
        case 'error.entity.already.exist': {
          notify({
            level: LevelType.ERROR,
            title: I18n.t('COMMON.EMAIL'),
            message: I18n.t('error.validation.email.exists'),
          });

          break;
        }

        default: {
          notify({
            level: LevelType.ERROR,
            title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
            message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
          });
        }
      }
    }

    confirmActionModal.hide();
  };

  const handleSubmitEmailClick = useCallback((values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    confirmActionModal.show({
      onSubmit: () => handleSubmitEmail(values),
      onCloseCallback: () => resetForm(),
      modalTitle: I18n.t('PLAYER_PROFILE.PROFILE.EMAIL.EMAIL_CHANGE.TITLE'),
      actionText: I18n.t('PLAYER_PROFILE.PROFILE.EMAIL.EMAIL_CHANGE.TEXT'),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  }, [confirmActionModal]);

  const handleVerifyPhone = useCallback(async () => {
    try {
      await verifyPhone({
        variables: {
          playerUUID: uuid,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [uuid, verifyPhone]);

  const handleVerifyEmail = useCallback(async () => {
    try {
      await verifyEmail({
        variables: {
          playerUUID: uuid,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [uuid, verifyEmail]);

  return {
    profileContacts,
    isAvailableToUpdateContacts,
    isAvailableToSeePhone,
    isAvailableToSeeAltPhone,
    isAvailableToSeeAltEmail,
    isPhonesShown,
    permission,
    isAvailableToUpdateEmail,
    isAvailableToSeeEmail,
    isEmailShown,
    isAdditionalEmailShown,
    getProfileEmail,
    handleSubmitContacts,
    getProfilePhones,
    handleVerifyPhone,
    handleSubmitEmailClick,
    handleVerifyEmail,
    getProfileAdditionalEmail,
  };
};

export default useClientContactsForm;
