import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Formik, Field, Form } from 'formik';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { withPermission } from 'providers/PermissionsProvider';
import PermissionContent from 'components/PermissionContent/PermissionContent';
import { Button } from 'components/UI';
import { FormikInputField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator } from 'utils/validator';
import { UpdateContactsMutation, VerifyPhoneMutation } from './graphql';

const attributeLabels = {
  phone: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.PHONE'),
  altPhone: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.ALT_PHONE'),
  additionalEmail: I18n.t('COMMON.EMAIL_ALT'),
};

const validator = createValidator({
  phone: 'required|string|min:3',
  additionalPhone: 'string',
  additionalEmail: 'string',
}, attributeLabels, false);

class ContactForm extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    phone: PropTypes.string,
    additionalPhone: PropTypes.string,
    additionalEmail: PropTypes.string,
    isPhoneVerified: PropTypes.bool.isRequired,
    updateContacts: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    verifyPhone: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
  };

  static defaultProps = {
    phone: '',
    additionalPhone: '',
    additionalEmail: '',
  };

  handleVerifyPhone = async () => {
    const { verifyPhone, notify } = this.props;

    try {
      await verifyPhone();

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY')}`,
      });
    }
  };

  onSubmit = async (variables, { resetForm }) => {
    const {
      notify,
      updateContacts,
    } = this.props;

    try {
      await updateContacts({ variables: decodeNullValues(variables) });
      resetForm();

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY')}`,
      });
    }
  };

  render() {
    const {
      permission,
      isPhoneVerified,
      additionalPhone,
      additionalEmail,
      disabled,
      phone,
    } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={{
          phone,
          additionalPhone,
          additionalEmail,
        }}
        onSubmit={this.onSubmit}
        validate={validator}
      >
        {({ isValid, dirty, errors, values: { phone: currentPhoneValue } }) => (
          <Form>
            <div className="row margin-bottom-20">
              <div className="col personal-form-heading">
                {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE')}
              </div>
              <div className="col-auto">
                <If condition={dirty && isValid && !disabled}>
                  <PermissionContent permissions={permissions.USER_PROFILE.UPDATE_CONTACTS}>
                    <div className="text-right">
                      <Button
                        small
                        primary
                        type="submit"
                      >
                        {I18n.t('COMMON.SAVE_CHANGES')}
                      </Button>
                    </div>
                  </PermissionContent>
                </If>
              </div>
            </div>
            <div className="form-row">
              <Field
                name="phone"
                component={FormikInputField}
                label={attributeLabels.phone}
                disabled={disabled || permission.denies(permissions.USER_PROFILE.FIELD_PHONE)}
                className="col-5"
              />
              <If condition={!errors.phone && !isPhoneVerified}>
                <PermissionContent permissions={permissions.USER_PROFILE.VERIFY_PHONE}>
                  <div className="col-4 mt-4-profile">
                    <Button
                      primary
                      onClick={this.handleVerifyPhone}
                    >
                      {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY')}
                    </Button>
                  </div>
                </PermissionContent>
              </If>
              <If condition={(phone === currentPhoneValue) && isPhoneVerified}>
                <div className="col-4 mt-4-profile">
                  <div className="btn-verified btn">
                    <i className="fa fa-check-circle-o margin-right-3 " />
                    <span>{I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}</span>
                  </div>
                </div>
              </If>
            </div>
            <div className="form-row">
              <Field
                name="additionalPhone"
                label={attributeLabels.altPhone}
                disabled={permission.denies(permissions.USER_PROFILE.FIELD_ADDITIONAL_PHONE)}
                placeholder={attributeLabels.altPhone}
                className="col-5"
                component={FormikInputField}
              />
              <Field
                name="additionalEmail"
                label={attributeLabels.additionalEmail}
                placeholder={attributeLabels.additionalEmail}
                disabled={permission.denies(permissions.USER_PROFILE.FIELD_ADDITIONAL_EMAIL)}
                className="col-8"
                component={FormikInputField}
              />
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default compose(
  withPermission,
  withNotifications,
  withRequests({
    updateContacts: UpdateContactsMutation,
    verifyPhone: VerifyPhoneMutation,
  }),
)(ContactForm);
