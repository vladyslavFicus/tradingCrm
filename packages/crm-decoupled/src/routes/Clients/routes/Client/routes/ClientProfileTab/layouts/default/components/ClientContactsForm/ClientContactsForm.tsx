import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Button } from 'components';
import { Config } from '@crm/common';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Profile } from '__generated__/types';
import { attributeLabels } from 'routes/Clients/routes/Client/routes/ClientProfileTab/constants/clientContactsForm';
import { FormValues } from 'routes/Clients/routes/Client/routes/ClientProfileTab/types/clientContactsForm';
import useClientContactsForm from 'routes/Clients/routes/Client/routes/ClientProfileTab/hooks/useClientContactsForm';
import './ClientContactsForm.scss';

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

  const {
    profileContacts,
    handleSubmitContacts,
    isAvailableToUpdateContacts,
    isAvailableToSeePhone,
    isAvailableToSeeAltPhone,
    isAvailableToSeeAltEmail,
    getProfilePhones,
    isPhonesShown,
    permission,
    handleVerifyPhone,
    handleSubmitEmailClick,
    isAvailableToUpdateEmail,
    isAvailableToSeeEmail,
    getProfileEmail,
    isEmailShown,
    handleVerifyEmail,
    getProfileAdditionalEmail,
    isAdditionalEmailShown,
  } = useClientContactsForm({ uuid });

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
                  data-testid="ClientContactsForm-saveChangesPhoneButton"
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
                  data-testid="ClientContactsForm-phoneInput"
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

                <If condition={!phoneVerified && permission.allows(Config.permissions.USER_PROFILE.VERIFY_PHONE)}>
                  <Button
                    className="ClientContactsForm__field-button"
                    data-testid="ClientContactsForm-verifyPhoneButton"
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
                    data-testid="ClientContactsForm-verifiedPhonesButton"
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
                  data-testid="ClientContactsForm-additionalPhoneInput"
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
                  data-testid="ClientContactsForm-saveChangesEmailButton"
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
                  data-testid="ClientContactsForm-emailInput"
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

                <If condition={!emailVerified && permission.allows(Config.permissions.USER_PROFILE.VERIFY_EMAIL)}>
                  <Button
                    className="ClientContactsForm__field-button"
                    data-testid="ClientContactsForm-verifyEmailButton"
                    onClick={handleVerifyEmail}
                    primary
                  >
                    {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY')}
                  </Button>
                </If>

                <If condition={profileContacts.email === values.email && emailVerified}>
                  <Button
                    className="ClientContactsForm__field-button"
                    data-testid="ClientContactsForm-verifiedEmailsButton"
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
                  data-testid="ClientContactsForm-saveChangesAdditionalEmailButton"
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
                  data-testid="ClientContactsForm-additionalEmailInput"
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
