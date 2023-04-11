import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import Trackify from '@hrzn/trackify';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import { createValidator, translateLabels } from 'utils/validator';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { Profile } from '__generated__/types';
import { useProfilePhonesQueryLazyQuery } from './graphql/__generated__/ProfilePhonesQuery';
import { useUpdateClientContactsMutation } from './graphql/__generated__/UpdateClientContactsMutation';
import { useUpdateClientEmailMutation } from './graphql/__generated__/UpdateClientEmailMutation';
import { useVerifyEmailMutation } from './graphql/__generated__/VerifyEmailMutation';
import { useVerifyPhoneMutation } from './graphql/__generated__/VerifyPhoneMutation';
import { useProfileEmailQueryLazyQuery } from './graphql/__generated__/ProfileEmailQuery';
import { useProfileAdditionalEmailQueryLazyQuery } from './graphql/__generated__/ProfileAdditionalEmailQuery';
import './ClientContactsForm.scss';

const attributeLabels = {
  email: 'COMMON.EMAIL',
  phone: 'PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.PHONE',
  additionalEmail: 'COMMON.EMAIL_ALT',
  additionalPhone: 'PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.ALT_PHONE',
};

type FormValues = {
  phone: string | null,
  additionalPhone: string | null,
  email: string | null,
  additionalEmail: string | null,
};

type Props = {
  profile: Profile,
};

const ClientContactsForm = (props: Props) => {
  const {
    profile: {
      uuid,
      contacts,
      phoneVerified,
      emailVerified,
    },
  } = props;

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const [isPhonesShown, setIsPhonesShown] = useState<boolean>(false);
  const [isEmailShown, setIsEmailShown] = useState<boolean>(false);
  const [isAdditionalEmailShown, setIsAdditionalEmailShown] = useState<boolean>(false);
  const [profileContacts, setProfileContacts] = useState<FormValues>({
    email: '',
    phone: '',
    additionalEmail: '',
    additionalPhone: '',
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

  const getProfilePhones = async () => {
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
  };

  const getProfileEmail = async () => {
    try {
      const { data } = await profileEmailQuery({ variables: { playerUUID: uuid } });

      Trackify.click('PROFILE_EMAILS_VIEWED', {
        eventLabel: uuid,
      });

      setProfileContacts({
        ...profileContacts,
        email: data?.profileContacts?.email || '',
      });

      setIsEmailShown(true);
    } catch {
      // do nothing...
    }
  };

  const getProfileAdditionalEmail = async () => {
    try {
      const { data } = await profileAdditionalEmailQuery({ variables: { playerUUID: uuid } });

      Trackify.click('PROFILE_EMAILS_VIEWED', {
        eventLabel: uuid,
      });

      setProfileContacts({
        ...profileContacts,
        additionalEmail: data?.profileContacts?.additionalEmail || '',
      });

      setIsAdditionalEmailShown(true);
    } catch {
    // do nothing...
    }
  };

  // ===== Handlers ===== //
  const handleSubmitContacts = async (values: FormValues) => {
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
        additionalEmail: isAdditionalEmailShown ? (values.additionalEmail || profileContacts.additionalEmail) : '',
        additionalPhone: isPhonesShown ? (values.additionalPhone || profileContacts.additionalPhone) : '',
        phone: isPhonesShown ? (values.phone || profileContacts.phone) : '',
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
  };

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

  const handleSubmitEmailClick = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    confirmActionModal.show({
      onSubmit: () => handleSubmitEmail(values),
      onCloseCallback: () => resetForm(),
      modalTitle: I18n.t('PLAYER_PROFILE.PROFILE.EMAIL.EMAIL_CHANGE.TITLE'),
      actionText: I18n.t('PLAYER_PROFILE.PROFILE.EMAIL.EMAIL_CHANGE.TEXT'),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  const handleVerifyPhone = async () => {
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
  };

  const handleVerifyEmail = async () => {
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
  };

  return (
    <div className="ClientContactsForm">
      <Formik
        initialValues={{
          additionalPhone: profileContacts.additionalPhone || contacts?.additionalPhone,
          phone: profileContacts.phone || contacts?.phone,
        } as FormValues}
        validate={createValidator({
          phone: 'required|string|min:3',
          additionalPhone: 'string',
        }, translateLabels(attributeLabels), false)}
        onSubmit={handleSubmitContacts}
        enableReinitialize
      >
        {({ values, isSubmitting, dirty }) => (
          <Form>
            <div className="ClientContactsForm__header">
              <div className="ClientContactsForm__title">
                {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE')}
              </div>

              <If condition={dirty && !isSubmitting && isAvailableToUpdateContacts}>
                <Button
                  small
                  primary
                  type="submit"
                  className="ClientContactsForm__actions"
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </If>
            </div>

            <div className="ClientContactsForm__fields">
              <div className="ClientContactsForm__field-column">
                <Field
                  name="phone"
                  className="ClientContactsForm__field"
                  label={I18n.t(attributeLabels.phone)}
                  placeholder={I18n.t(attributeLabels.phone)}
                  component={FormikInputField}
                  addition={
                        (isAvailableToSeePhone
                          || isAvailableToSeeAltPhone
                          || isAvailableToSeeAltEmail)
                        && I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.SHOW')}
                  additionClassName="ClientContactsForm__field-addition"
                  additionPosition="right"
                  onAdditionClick={getProfilePhones}
                  disabled={isSubmitting
                      || !isAvailableToSeePhone
                      || !isAvailableToUpdateContacts
                      || !isPhonesShown}
                />

                <If condition={!phoneVerified && permission.allows(permissions.USER_PROFILE.VERIFY_PHONE)}>
                  <Button
                    className="ClientContactsForm__field-button"
                    onClick={handleVerifyPhone}
                    primary
                  >
                    {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY')}
                  </Button>
                </If>

                <If condition={(contacts?.phone === values.phone || profileContacts.phone === values.phone)
                     && phoneVerified}
                >
                  <Button
                    className="ClientContactsForm__field-button"
                    primary
                  >
                    <i className="fa fa-check-circle-o" />

                    <span>{I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}</span>
                  </Button>
                </If>
              </div>

              <div className="ClientContactsForm__field-column">
                <Field
                  name="additionalPhone"
                  className="ClientContactsForm__field"
                  label={I18n.t(attributeLabels.additionalPhone)}
                  placeholder={I18n.t(attributeLabels.additionalPhone)}
                  component={FormikInputField}
                  disabled={isSubmitting
                      || !isAvailableToSeeAltPhone
                      || !isAvailableToUpdateContacts
                      || !isPhonesShown}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <hr />

      <Formik
        initialValues={{
          email: profileContacts.email || contacts?.email,
        } as FormValues}
        validate={createValidator({
          email: 'required|email',
        }, translateLabels(attributeLabels), false)}
        onSubmit={handleSubmitEmailClick}
        enableReinitialize
      >
        {({ values, isSubmitting, dirty }) => (
          <Form>
            <If condition={dirty && !isSubmitting && isAvailableToUpdateEmail}>
              <div className="ClientContactsForm__header">
                <Button
                  small
                  primary
                  type="submit"
                  className="ClientContactsForm__actions"
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </div>
            </If>

            <div className="ClientContactsForm__fields">
              <div className="ClientContactsForm__field-column">
                <Field
                  name="email"
                  className="ClientContactsForm__field"
                  label={I18n.t(attributeLabels.email)}
                  placeholder={I18n.t(attributeLabels.email)}
                  component={FormikInputField}
                  addition={isAvailableToSeeEmail && I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.SHOW')}
                  additionClassName="ClientContactsForm__field-addition"
                  additionPosition="right"
                  onAdditionClick={getProfileEmail}
                  disabled={isSubmitting
                      || !isAvailableToUpdateEmail
                      || !isAvailableToSeeEmail
                      || !isEmailShown}
                />

                <If condition={!emailVerified && permission.allows(permissions.USER_PROFILE.VERIFY_EMAIL)}>
                  <Button
                    className="ClientContactsForm__field-button"
                    onClick={handleVerifyEmail}
                    primary
                  >
                    {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY')}
                  </Button>
                </If>

                <If condition={profileContacts.email === values.email && emailVerified}>
                  <Button
                    className="ClientContactsForm__field-button"
                    primary
                  >
                    <i className="fa fa-check-circle-o" />

                    <span>{I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}</span>
                  </Button>
                </If>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <Formik
        initialValues={{
          additionalEmail: profileContacts.additionalEmail || contacts?.additionalEmail,
        } as FormValues}
        validate={createValidator({
          additionalEmail: 'string',
        }, translateLabels(attributeLabels), false)}
        onSubmit={handleSubmitContacts}
        enableReinitialize
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <If condition={dirty && !isSubmitting && isAvailableToUpdateContacts}>
              <div className="ClientContactsForm__header">
                <Button
                  small
                  primary
                  type="submit"
                  className="ClientContactsForm__actions"
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </div>
            </If>

            <div className="ClientContactsForm__fields">
              <div className="ClientContactsForm__field-column">
                <Field
                  name="additionalEmail"
                  className="ClientContactsForm__field"
                  label={I18n.t(attributeLabels.additionalEmail)}
                  placeholder={I18n.t(attributeLabels.additionalEmail)}
                  component={FormikInputField}
                  addition={isAvailableToSeeAltEmail && I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.SHOW')}
                  additionClassName="ClientContactsForm__field-addition"
                  additionPosition="right"
                  onAdditionClick={getProfileAdditionalEmail}
                  disabled={isSubmitting
                        || !isAvailableToSeeAltEmail
                        || !isAvailableToUpdateContacts
                        || !isAdditionalEmailShown}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(ClientContactsForm);
