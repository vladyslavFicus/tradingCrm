import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withNotifications, withModals } from 'hoc';
import { parseErrors, withRequests } from 'apollo';
import Trackify from '@hrzn/trackify';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import Permissions from 'utils/permissions';
import { createValidator, translateLabels } from 'utils/validator';
import PropTypes from 'constants/propTypes';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import PermissionContent from 'components/PermissionContent';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import UpdateClientContactsMutation from './graphql/UpdateClientContactsMutation';
import UpdateClientEmailMutation from './graphql/UpdateClientEmailMutation';
import VerifyPhoneMutation from './graphql/VerifyPhoneMutation';
import VerifyEmailMutation from './graphql/VerifyEmailMutation';
import ProfilePhonesQuery from './graphql/ProfilePhonesQuery';
import ProfileEmailQuery from './graphql/ProfileEmailQuery';
import ProfileAdditionalEmailQuery from './graphql/ProfileAdditionalEmailQuery';
import './ClientContactsForm.scss';

const attributeLabels = {
  email: 'COMMON.EMAIL',
  phone: 'PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.PHONE',
  additionalEmail: 'COMMON.EMAIL_ALT',
  additionalPhone: 'PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.ALT_PHONE',
};

class ClientContactsForm extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType.isRequired,
    }).isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    clientData: PropTypes.profile.isRequired,
    permission: PropTypes.permission.isRequired,
    updateClientContacts: PropTypes.func.isRequired,
    updateClientEmail: PropTypes.func.isRequired,
    verifyPhone: PropTypes.func.isRequired,
    verifyEmail: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  state = {
    additionalEmail: undefined,
    additionalPhone: undefined,
    email: undefined,
    phone: undefined,
    isPhonesShown: false,
    isEmailShown: false,
    isAdditionalEmailShown: false,
  }

  getProfilePhones = async () => {
    const { clientData: { uuid }, notify } = this.props;

    try {
      const { data: {
        profileContacts: { additionalPhone, phone } } } = await this.props.client.query({
        query: ProfilePhonesQuery,
        variables: { playerUUID: uuid },
        fetchPolicy: 'network-only',
      });

      Trackify.click('PROFILE_PHONES_VIEWED', {
        eventLabel: uuid,
      });

      this.setState({
        additionalPhone,
        phone,
        isPhonesShown: true,
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  getProfileEmail = async () => {
    const { clientData: { uuid }, notify } = this.props;

    try {
      const { data: {
        profileContacts: { email } } } = await this.props.client.query({
        query: ProfileEmailQuery,
        variables: { playerUUID: uuid },
        fetchPolicy: 'network-only',
      });

      Trackify.click('PROFILE_EMAILS_VIEWED', {
        eventLabel: uuid,
      });

      this.setState({
        email,
        isEmailShown: true,
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  getProfileAdditionalEmail = async () => {
    const { clientData: { uuid }, notify } = this.props;

    try {
      const { data: {
        profileContacts: { additionalEmail } } } = await this.props.client.query({
        query: ProfileAdditionalEmailQuery,
        variables: { playerUUID: uuid },
        fetchPolicy: 'network-only',
      });

      Trackify.click('PROFILE_EMAILS_VIEWED', {
        eventLabel: uuid,
      });

      this.setState({
        additionalEmail,
        isAdditionalEmailShown: true,
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  handleSubmitContacts = async (values) => {
    const {
      updateClientContacts,
      clientData,
      notify,
    } = this.props;
    const { isPhonesShown, isAdditionalEmailShown, additionalEmail, additionalPhone, phone } = this.state;

    try {
      await updateClientContacts({
        variables: {
          playerUUID: clientData.uuid,
          phone: isPhonesShown ? (values.phone || phone) : null,
          additionalPhone: isPhonesShown ? (values.additionalPhone || additionalPhone) : null,
          additionalEmail: isAdditionalEmailShown ? (values.additionalEmail || additionalEmail) : null,
        },
      });

      this.setState({
        additionalEmail: isAdditionalEmailShown ? (values.additionalEmail || additionalEmail) : undefined,
        additionalPhone: isPhonesShown ? (values.additionalPhone || additionalPhone) : undefined,
        phone: isPhonesShown ? (values.phone || phone) : undefined,
      });

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const { error } = parseErrors(e);

      switch (error) {
        case 'error.phone.already.exist': {
          notify({
            level: 'error',
            title: I18n.t('COMMON.PHONE'),
            message: I18n.t('error.validation.phone.exists'),
          });

          break;
        }

        default: {
          notify({
            level: 'error',
            title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
            message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
          });
        }
      }
    }
  }

  handleSubmitEmailClick = (values, form) => {
    this.props.modals.confirmationModal.show({
      onSubmit: () => this.handleSubmitEmail(values),
      onCloseCallback: () => form.resetForm(),
      modalTitle: I18n.t('PLAYER_PROFILE.PROFILE.EMAIL.EMAIL_CHANGE.TITLE'),
      actionText: I18n.t('PLAYER_PROFILE.PROFILE.EMAIL.EMAIL_CHANGE.TEXT'),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  handleSubmitEmail = async (values) => {
    const {
      updateClientEmail,
      clientData,
      notify,
      modals: { confirmationModal },
    } = this.props;

    try {
      await updateClientEmail({
        variables: {
          playerUUID: clientData.uuid,
          email: values.email,
        },
      });

      this.setState({
        email: values.email,
      });

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const { error } = parseErrors(e);

      switch (error) {
        case 'error.entity.already.exist': {
          notify({
            level: 'error',
            title: I18n.t('COMMON.EMAIL'),
            message: I18n.t('error.validation.email.exists'),
          });

          break;
        }

        default: {
          notify({
            level: 'error',
            title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
            message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
          });
        }
      }
    }

    confirmationModal.hide();
  }

  handleVerifyPhone = async () => {
    const { clientData, verifyPhone, notify } = this.props;

    try {
      await verifyPhone({
        variables: {
          playerUUID: clientData.uuid,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleVerifyEmail = async () => {
    const { clientData, verifyEmail, notify } = this.props;

    try {
      await verifyEmail({
        variables: {
          playerUUID: clientData.uuid,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  render() {
    const {
      clientData,
      permission: {
        permissions: currentPermissions,
        allows,
      },
    } = this.props;

    const {
      contacts,
      phoneVerified,
      emailVerified,
    } = clientData;

    const {
      email,
      phone,
      additionalPhone,
      additionalEmail,
    } = contacts || {};

    const isAvailableToSeePhone = allows(permissions.USER_PROFILE.FIELD_PHONE);
    const isAvailableToSeeAltPhone = allows(permissions.USER_PROFILE.FIELD_ADDITIONAL_PHONE);
    const isAvailableToSeeAltEmail = allows(permissions.USER_PROFILE.FIELD_ADDITIONAL_EMAIL);
    const isAvailableToSeeEmail = allows(permissions.USER_PROFILE.FIELD_EMAIL);

    const isAvailableToUpdateContacts = new Permissions(permissions.USER_PROFILE.UPDATE_CONTACTS)
      .check(currentPermissions);
    const isAvailableToUpdateEmail = allows(permissions.USER_PROFILE.UPDATE_EMAIL);

    return (
      <>
        <div className="ClientContactsForm">
          <Formik
            initialValues={{
              additionalPhone: this.state.additionalPhone || additionalPhone,
              phone: this.state.phone || phone,
            }}
            validate={createValidator({
              phone: 'required|string|min:3',
              additionalPhone: 'string',
            }, translateLabels(attributeLabels), false)}
            onSubmit={this.handleSubmitContacts}
            enableReinitialize
          >
            {({ values, isSubmitting, dirty }) => (
              <Form>
                <div className="ClientContactsForm__header">
                  <div className="ClientContactsForm__title">
                    {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE')}
                  </div>

                  <If condition={dirty && !isSubmitting && isAvailableToUpdateContacts}>
                    <div className="ClientContactsForm__actions">
                      <Button
                        small
                        primary
                        type="submit"
                      >
                        {I18n.t('COMMON.SAVE_CHANGES')}
                      </Button>
                    </div>
                  </If>
                </div>

                <div className="ClientContactsForm__fields">
                  <div className="ClientContactsForm__field-row">
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
                      onAdditionClick={this.getProfilePhones}
                      disabled={isSubmitting
                      || !isAvailableToSeePhone
                      || !isAvailableToUpdateContacts
                      || !this.state.isPhonesShown}
                    />

                    <If condition={!phoneVerified}>
                      <PermissionContent permissions={permissions.USER_PROFILE.VERIFY_PHONE}>
                        <Button
                          className="ClientContactsForm__field-button"
                          onClick={this.handleVerifyPhone}
                          primary
                        >
                          {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY')}
                        </Button>
                      </PermissionContent>
                    </If>

                    <If condition={(phone === values.phone || this.state.phone === values.phone) && phoneVerified}>
                      <Button
                        className="ClientContactsForm__field-button"
                        verified
                      >
                        <i className="fa fa-check-circle-o" />
                        <span>{I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}</span>
                      </Button>
                    </If>
                  </div>

                  <div className="ClientContactsForm__field-row">
                    <Field
                      name="additionalPhone"
                      className="ClientContactsForm__field"
                      label={I18n.t(attributeLabels.additionalPhone)}
                      placeholder={I18n.t(attributeLabels.additionalPhone)}
                      component={FormikInputField}
                      disabled={isSubmitting
                      || !isAvailableToSeeAltPhone
                      || !isAvailableToUpdateContacts
                      || !this.state.isPhonesShown}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          <hr />
          <Formik
            initialValues={{
              email: this.state.email || email,
            }}
            validate={createValidator({
              email: 'required|email',
            }, translateLabels(attributeLabels), false)}
            onSubmit={this.handleSubmitEmailClick}
            enableReinitialize
          >
            {({ values, isSubmitting, dirty }) => (
              <Form>

                <div className="ClientContactsForm__header">
                  <If condition={dirty && !isSubmitting && isAvailableToUpdateEmail}>
                    <div className="ClientContactsForm__actions">
                      <Button
                        small
                        primary
                        type="submit"
                      >
                        {I18n.t('COMMON.SAVE_CHANGES')}
                      </Button>
                    </div>
                  </If>
                </div>

                <div className="ClientContactsForm__fields">
                  <div className="ClientContactsForm__field-row">
                    <Field
                      name="email"
                      className="ClientContactsForm__field"
                      label={I18n.t(attributeLabels.email)}
                      placeholder={I18n.t(attributeLabels.email)}
                      component={FormikInputField}
                      addition={isAvailableToSeeEmail && I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.SHOW')}
                      additionClassName="ClientContactsForm__field-addition"
                      additionPosition="right"
                      onAdditionClick={this.getProfileEmail}
                      disabled={isSubmitting
                      || !isAvailableToUpdateEmail
                      || !isAvailableToSeeEmail
                      || !this.state.isEmailShown}
                    />

                    <If condition={!emailVerified}>
                      <PermissionContent permissions={permissions.USER_PROFILE.VERIFY_EMAIL}>
                        <Button
                          className="ClientContactsForm__field-button"
                          onClick={this.handleVerifyEmail}
                          primary
                        >
                          {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY')}
                        </Button>
                      </PermissionContent>
                    </If>

                    <If condition={email === values.email && emailVerified}>
                      <Button
                        className="ClientContactsForm__field-button"
                        verified
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
              additionalEmail: this.state.additionalEmail || additionalEmail,
            }}
            validate={createValidator({
              additionalEmail: 'string',
            }, translateLabels(attributeLabels), false)}
            onSubmit={this.handleSubmitContacts}
            enableReinitialize
          >
            {({ isSubmitting, dirty }) => (
              <Form>
                <div className="ClientContactsForm__header">
                  <If condition={dirty && !isSubmitting && isAvailableToUpdateContacts}>
                    <div className="ClientContactsForm__actions">
                      <Button
                        small
                        primary
                        type="submit"
                      >
                        {I18n.t('COMMON.SAVE_CHANGES')}
                      </Button>
                    </div>
                  </If>
                </div>

                <div className="ClientContactsForm__fields">
                  <div className="ClientContactsForm__field-row">
                    <Field
                      name="additionalEmail"
                      className="ClientContactsForm__field"
                      label={I18n.t(attributeLabels.additionalEmail)}
                      placeholder={I18n.t(attributeLabels.additionalEmail)}
                      component={FormikInputField}
                      addition={isAvailableToSeeAltEmail && I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.SHOW')}
                      additionClassName="ClientContactsForm__field-addition"
                      additionPosition="right"
                      onAdditionClick={this.getProfileAdditionalEmail}
                      disabled={isSubmitting
                        || !isAvailableToSeeAltEmail
                        || !isAvailableToUpdateContacts
                        || !this.state.isAdditionalEmailShown}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </>
    );
  }
}

export default compose(
  withApollo,
  withPermission,
  withNotifications,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
  withRequests({
    updateClientContacts: UpdateClientContactsMutation,
    updateClientEmail: UpdateClientEmailMutation,
    verifyPhone: VerifyPhoneMutation,
    verifyEmail: VerifyEmailMutation,
  }),
)(ClientContactsForm);
