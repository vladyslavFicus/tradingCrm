import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import I18n from 'i18n-js';
import { Field, reduxForm, getFormSyncErrors, getFormValues } from 'redux-form';
import PropTypes from 'constants/propTypes';
import { InputField } from 'components/ReduxForm';
import PermissionContent from 'components/PermissionContent/PermissionContent';
import permissions from 'config/permissions';
import { createValidator } from 'utils/validator';

const FORM_NAME = 'updateProfilePhone';
const attributeLabels = () => ({
  phone: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.PHONE'),
  phoneCode: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.PHONE_CODE'),
  AltPhone: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.ALT_PHONE'),
  AltPhoneCode: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.YOUR_ALT_PHONE'),
});

class PhoneForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    dirty: PropTypes.bool,
    valid: PropTypes.bool,
    profile: PropTypes.userProfile.isRequired,
    initialValues: PropTypes.shape({
      phone: PropTypes.string,
      additionalPhone: PropTypes.string,
    }),
    currentValues: PropTypes.shape({
      phone: PropTypes.string,
      additionalPhone: PropTypes.string,
    }),
    onVerifyPhoneClick: PropTypes.func.isRequired,
    formSyncErrors: PropTypes.object,
    disabled: PropTypes.bool,
  };

  static contextTypes = {
    tradingOperatorAccessDisabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    handleSubmit: null,
    dirty: false,
    valid: true,
    initialValues: {},
    currentValues: {},
    formSyncErrors: {},
    disabled: false,
  };

  handleVerifyPhoneClick = () => {
    const { currentValues, onVerifyPhoneClick } = this.props;

    return onVerifyPhoneClick(currentValues.phone, currentValues.phoneCode);
  };

  render() {
    const {
      handleSubmit,
      dirty,
      valid,
      disabled,
      initialValues,
      currentValues,
      formSyncErrors,
      profile,
      onSubmit,
    } = this.props;

    const { tradingOperatorAccessDisabled } = this.context;

    const isPhoneDirty = currentValues.phone !== initialValues.phone;
    const isPhoneValid = !formSyncErrors.phone && !formSyncErrors.phoneCode;
    const isPhoneVerifiable = isPhoneValid && (isPhoneDirty || !profile.phoneVerified);

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col personal-form-heading">
            {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE')}
          </div>
          <div className="col-auto">
            <If condition={dirty && valid && !disabled}>
              <button className="btn btn-sm btn-primary" type="submit">
                {I18n.t('COMMON.SAVE_CHANGES')}
              </button>
            </If>
          </div>
        </div>
        <div className="form-row">
          <Field
            name="phone"
            type="text"
            component={InputField}
            label={attributeLabels().phone}
            disabled={disabled || tradingOperatorAccessDisabled}
            className="col-5"
          />
          <If condition={isPhoneVerifiable}>
            <PermissionContent permissions={permissions.USER_PROFILE.VERIFY_PHONE}>
              <div className="col-4 mt-4">
                <button type="button" className="btn btn-primary width-full" onClick={this.handleVerifyPhoneClick}>
                  {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY')}
                </button>
              </div>
            </PermissionContent>
          </If>
          <If condition={!isPhoneDirty && profile.phoneVerified}>
            <div className="col-4 mt-4">
              <button type="button" className="btn btn-verified">
                <i className="fa fa-check-circle-o" /> {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}
              </button>
            </div>
          </If>
        </div>
        <div className="form-row">
          <Field
            type="text"
            name="additionalPhone"
            component={InputField}
            label={attributeLabels().AltPhone}
            placeholder={attributeLabels().AltPhoneCode}
            className="col-5"
          />
        </div>
      </form>
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
    validate: createValidator({
      phone: 'required|string',
    }, attributeLabels(), false),
    enableReinitialize: true,
  }),
)(PhoneForm);
