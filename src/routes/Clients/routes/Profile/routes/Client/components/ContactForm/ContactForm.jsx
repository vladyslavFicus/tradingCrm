import React, { Fragment, Component } from 'react';
import I18n from 'i18n-js';
import { Field, getFormSyncErrors, getFormValues, reduxForm } from 'redux-form';
import { departments, roles } from 'constants/brands';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createValidator } from 'utils/validator';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent/PermissionContent';
import { InputField } from 'components/ReduxForm';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';

const FORM_NAME = 'updateProfileContacts';
const attributeLabels = {
  phone: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.PHONE'),
  phoneCode: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.PHONE_CODE'),
  altPhone: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.ALT_PHONE'),
  altPhoneCode: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.YOUR_ALT_PHONE'),
  additionalEmail: I18n.t('COMMON.EMAIL_ALT'),
};

class ContactForm extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onVerifyPhoneClick: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    formSyncErrors: PropTypes.object,
    dirty: PropTypes.bool,
    valid: PropTypes.bool,
    initialValues: PropTypes.shape({
      phone: PropTypes.string,
      additionalPhone: PropTypes.string,
      additionalEmail: PropTypes.string,
    }),
    currentValues: PropTypes.shape({
      phone: PropTypes.string,
      additionalPhone: PropTypes.string,
      additionalEmail: PropTypes.string,
    }),
    verification: PropTypes.shape({
      phoneVerified: PropTypes.bool,
    }),
    auth: PropTypes.auth.isRequired,
    disabledAdditionalPhone: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    handleSubmit: null,
    disabled: false,
    dirty: false,
    valid: true,
    initialValues: {},
    currentValues: {},
    formSyncErrors: {},
    verification: {},
  };

  handleVerifyPhoneClick = () => {
    const { currentValues, onVerifyPhoneClick } = this.props;

    return onVerifyPhoneClick(currentValues.phone, currentValues.phoneCode);
  };

  render() {
    const {
      disabledAdditionalPhone,
      verification: {
        phoneVerified,
      },
      disabled,
      onSubmit,
      handleSubmit,
      dirty,
      valid,
      initialValues,
      currentValues,
      formSyncErrors,
      auth: {
        department,
        role,
      },
    } = this.props;
    const { tradingOperatorAccessDisabled } = this.context;

    const isPhoneDirty = currentValues.phone !== initialValues.phone;
    const isPhoneValid = !formSyncErrors.phone && !formSyncErrors.phoneCode;
    const isPhoneVerifiable = isPhoneValid && (isPhoneDirty || !phoneVerified);
    const areFieldsDisabled = (department === departments.CS || department === departments.ADMINISTRATION)
      && role === roles.ROLE4;

    return (
      <Fragment>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row margin-bottom-20">
            <div className="col personal-form-heading">
              {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE')}
            </div>
            <div className="col-auto">
              <If condition={dirty && valid && !disabled}>
                <PermissionContent permissions={permissions.USER_PROFILE.UPDATE_CONTACTS}>
                  <div className="text-right">
                    <If condition={dirty && valid && !disabled}>
                      <button className="btn btn-sm btn-primary" type="submit">
                        {I18n.t('COMMON.SAVE_CHANGES')}
                      </button>
                    </If>
                  </div>
                </PermissionContent>
              </If>
            </div>
          </div>
          <div className="form-row">
            <Field
              name="phone"
              type="text"
              component={InputField}
              label={attributeLabels.phone}
              disabled={disabled || tradingOperatorAccessDisabled || !areFieldsDisabled}
              className="col-5"
            />
            <If condition={isPhoneVerifiable}>
              <PermissionContent permissions={permissions.USER_PROFILE.VERIFY_PHONE}>
                <div className="col-4 mt-4-profile">
                  <button type="button" className="btn btn-primary width-full" onClick={this.handleVerifyPhoneClick}>
                    {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY')}
                  </button>
                </div>
              </PermissionContent>
            </If>
            <If condition={!isPhoneDirty && phoneVerified}>
              <div className="col-4 mt-4-profile">
                <button type="button" className="btn btn-verified">
                  <i className="fa fa-check-circle-o" /> {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}
                </button>
              </div>
            </If>
          </div>
          <div className="form-row">
            <Field
              disabled={disabledAdditionalPhone}
              type="text"
              name="additionalPhone"
              component={InputField}
              label={attributeLabels.altPhone}
              placeholder={attributeLabels.altPhoneCode}
              className="col-5"
            />
            <Field
              name="additionalEmail"
              label={attributeLabels.additionalEmail}
              type="text"
              component={InputField}
              className="col-8"
            />
          </div>
        </form>
      </Fragment>
    );
  }
}

export default compose(
  connect(state => ({
    currentValues: getFormValues(FORM_NAME)(state),
    formSyncErrors: getFormSyncErrors(FORM_NAME)(state),
  })),
  reduxForm({
    form: FORM_NAME,
    touchOnChange: true,
    validate: createValidator({
      phone: 'required|string',
      additionalPhone: 'string',
    }, attributeLabels, false),
    enableReinitialize: true,
  }),
  withStorage(['auth']),
)(ContactForm);
