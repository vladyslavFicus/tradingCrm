import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withNotifications, withModals } from 'hoc';
import { parseErrors, withRequests } from 'apollo';
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
    clientData: PropTypes.profile.isRequired,
    permission: PropTypes.permission.isRequired,
    updateClientContacts: PropTypes.func.isRequired,
    updateClientEmail: PropTypes.func.isRequired,
    verifyPhone: PropTypes.func.isRequired,
    verifyEmail: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleSubmitContacts = async (values) => {
    const {
      updateClientContacts,
      clientData,
      notify,
    } = this.props;

    try {
      await updateClientContacts({
        variables: {
          playerUUID: clientData.uuid,
          phone: values.phone,
          additionalPhone: values.additionalPhone,
          additionalEmail: values.additionalEmail,
        },
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

    const isAvailableToUpdatePhone = allows(permissions.USER_PROFILE.FIELD_PHONE);
    const isAvailableToUpdateEmail = allows(permissions.USER_PROFILE.FIELD_EMAIL);
    const isAvailableToUpdateAltPhone = allows(permissions.USER_PROFILE.FIELD_ADDITIONAL_PHONE);
    const isAvailableToUpdateAltEmail = allows(permissions.USER_PROFILE.FIELD_ADDITIONAL_EMAIL);

    const isAvailableToUpdateContacts = new Permissions(permissions.USER_PROFILE.UPDATE_CONTACTS)
      .check(currentPermissions);

    return (
      <>
        <div className="ClientContactsForm">
          <Formik
            initialValues={{
              phone,
              additionalPhone,
              additionalEmail,
            }}
            validate={createValidator({
              phone: 'required|string|min:3',
              additionalPhone: 'string',
              additionalEmail: 'string',
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
                      disabled={isSubmitting || !isAvailableToUpdatePhone || !isAvailableToUpdateContacts}
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

                    <If condition={phone === values.phone && phoneVerified}>
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
                      disabled={isSubmitting || !isAvailableToUpdateAltPhone || !isAvailableToUpdateContacts}
                    />
                  </div>

                  <div className="ClientContactsForm__field-row">
                    <Field
                      name="additionalEmail"
                      className="ClientContactsForm__field"
                      label={I18n.t(attributeLabels.additionalEmail)}
                      placeholder={I18n.t(attributeLabels.additionalEmail)}
                      component={FormikInputField}
                      disabled={isSubmitting || !isAvailableToUpdateAltEmail || !isAvailableToUpdateContacts}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          <hr />
          <Formik
            initialValues={{
              email,
            }}
            validate={createValidator({
              email: 'required|email',
            }, translateLabels(attributeLabels), false)}
            onSubmit={this.handleSubmitEmailClick}
            enableReinitialize
          >
            {({ values, isSubmitting, dirty }) => (
              <Form>
                <div className="ClientContactsForm__fields">
                  <div className="ClientContactsForm__field-row">
                    <Field
                      name="email"
                      className="ClientContactsForm__field"
                      label={I18n.t(attributeLabels.email)}
                      placeholder={I18n.t(attributeLabels.email)}
                      component={FormikInputField}
                      disabled={isSubmitting || !isAvailableToUpdateEmail}
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
              </Form>
            )}
          </Formik>
        </div>
      </>
    );
  }
}

export default compose(
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
