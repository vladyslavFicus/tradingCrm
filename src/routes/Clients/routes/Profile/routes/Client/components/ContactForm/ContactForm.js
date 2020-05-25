import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Formik, Field, Form } from 'formik';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import { getBrand } from 'config';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { withNotifications } from 'hoc';
import PermissionContent from 'components/PermissionContent/PermissionContent';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator } from 'utils/validator';
import { hideText } from 'utils/hideText';
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
    auth: PropTypes.auth.isRequired,
    updateContacts: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    verifyPhone: PropTypes.func.isRequired,
  };

  static defaultProps = {
    phone: '',
    additionalPhone: '',
    additionalEmail: '',
  };

  phoneAccess = () => {
    const {
      auth: { department },
    } = this.props;

    return !getBrand().privatePhoneByDepartment.includes(department);
  };

  emailAccess = () => {
    const {
      auth: { department },
    } = this.props;

    return !getBrand().privateEmailByDepartment.includes(department);
  };

  handleVerifyPhone = async (phone) => {
    const { verifyPhone, notify } = this.props;

    const {
      data: {
        profile: {
          verifyPhone: {
            error,
          },
        },
      },
    } = await verifyPhone({ variables: { phone } });

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
      message: `${I18n.t('COMMON.ACTIONS.UPDATED')}
        ${error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
    });
  };


  onSubmit = async ({
    additionalPhone: currentAdditionalPhone,
    additionalEmail: currentAdditionalEmail,
    phone: currentPhone,
  }) => {
    const {
      additionalPhone,
      additionalEmail,
      updateContacts,
      notify,
      phone,
    } = this.props;

    const variables = {
      phone: this.phoneAccess() ? currentPhone : phone,
      additionalPhone: this.phoneAccess() ? currentAdditionalPhone : additionalPhone,
      additionalEmail: this.emailAccess() ? currentAdditionalEmail : additionalEmail,
    };

    const {
      data: {
        profile: {
          updateContacts: {
            error,
          },
        },
      },
    } = await updateContacts({
      variables,
    });

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
      message: `${I18n.t('COMMON.ACTIONS.UPDATED')}
        ${error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
    });
  };

  render() {
    const {
      isPhoneVerified,
      additionalPhone,
      additionalEmail,
      disabled,
      phone,
    } = this.props;
    const { tradingOperatorAccessDisabled } = this.context;

    return (
      <Formik
        initialValues={{
          phone: this.phoneAccess() ? phone : hideText(phone),
          additionalPhone: this.phoneAccess() ? additionalPhone : hideText(additionalPhone),
          additionalEmail: this.emailAccess() ? additionalEmail : hideText(additionalEmail),
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
                disabled={disabled || tradingOperatorAccessDisabled || !this.phoneAccess()}
                className="col-5"
              />
              <If condition={
                !errors.phone
                && !this.phoneAccess()
                && !isPhoneVerified}
              >
                <PermissionContent permissions={permissions.USER_PROFILE.VERIFY_PHONE}>
                  <div className="col-4 mt-4-profile">
                    <Button
                      primary
                      className="width-full"
                      onClick={() => this.handleVerifyPhone(currentPhoneValue)}
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
                disabled={!this.phoneAccess()}
                placeholder={attributeLabels.altPhone}
                className="col-5"
                component={FormikInputField}
              />
              <Field
                name="additionalEmail"
                label={attributeLabels.additionalEmail}
                placeholder={attributeLabels.additionalEmail}
                disabled={!this.emailAccess()}
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
  withStorage(['auth']),
  withNotifications,
  withRequests({
    updateContacts: UpdateContactsMutation,
    verifyPhone: VerifyPhoneMutation,
  }),
)(ContactForm);
