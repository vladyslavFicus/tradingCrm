import React, { Component } from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Field, reduxForm, getFormSyncErrors, getFormValues } from 'redux-form';
import PropTypes from '../../../../../../../../constants/propTypes';
import { InputField, SelectField } from '../../../../../../../../components/ReduxForm';
import PermissionContent from '../../../../../../../../components/PermissionContent/PermissionContent';
import { createValidator } from '../../../../../../../../utils/validator';
import permissions from '../../../../../../../../config/permissions';

const FORM_NAME = 'updateProfilePhone';
const attributeLabels = {
  phone: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.PHONE'),
  phoneCode: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.PHONE_CODE'),
};

class PhoneForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    dirty: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    profile: PropTypes.userProfile.isRequired,
    initialValues: PropTypes.shape({
      phoneCode: PropTypes.string,
      phone: PropTypes.string,
    }),
    currentValues: PropTypes.shape({
      phoneCode: PropTypes.string,
      phone: PropTypes.string,
    }),
    phoneCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onVerifyPhoneClick: PropTypes.func.isRequired,
    formSyncErrors: PropTypes.object,
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    handleSubmit: null,
    dirty: false,
    submitting: false,
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
      submitting,
      valid,
      disabled,
      initialValues,
      currentValues,
      formSyncErrors,
      profile,
      phoneCodes,
      onSubmit,
    } = this.props;

    const isPhoneDirty = currentValues.phone !== initialValues.phone ||
      currentValues.phoneCode !== initialValues.phoneCode;

    const isPhoneValid = !formSyncErrors.phone && !formSyncErrors.phoneCode;
    const isPhoneVerifiable = isPhoneValid && (isPhoneDirty || !profile.phoneNumberVerified);

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col personal-form-heading">
            {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE')}
          </div>
          <div className="col-auto">
            <If condition={dirty && !submitting && valid && !disabled}>
              <button className="btn btn-sm btn-primary" type="submit">
                {I18n.t('COMMON.SAVE_CHANGES')}
              </button>
            </If>
          </div>
        </div>
        <div className="form-row">
          <Field
            name="phoneCode"
            component={SelectField}
            position="vertical"
            label={attributeLabels.phoneCode}
            disabled={disabled}
            className="col-3"
          >
            <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
            {phoneCodes.map(code => <option key={code} value={code}>+{code}</option>)}
          </Field>
          <Field
            name="phone"
            type="text"
            component={InputField}
            label={attributeLabels.phone}
            position="vertical"
            disabled={disabled}
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
          <If condition={!isPhoneDirty && profile.phoneNumberVerified}>
            <div className="col-4 mt-4">
              <button type="button" className="btn btn-verified">
                <i className="fa fa-check-circle-o" /> {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}
              </button>
            </div>
          </If>
        </div>
      </form>
    );
  }
}

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
  formSyncErrors: getFormSyncErrors(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: createValidator({
      phone: 'required|numeric',
      phoneCode: 'required|numeric',
    }, attributeLabels, false),
    enableReinitialize: true,
  })(PhoneForm),
);
