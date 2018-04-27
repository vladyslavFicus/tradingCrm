import React, { Component } from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Field, reduxForm, getFormSyncErrors, getFormValues } from 'redux-form';
import PropTypes from '../../../../../../constants/propTypes';
import { InputField, SelectField } from '../../../../../../components/ReduxForm';
import PermissionContent from '../../../../../../components/PermissionContent/PermissionContent';
import { createValidator } from '../../../../../../utils/validator';
import permissions from '../../../../../../config/permissions';

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
          <div className="col-xl-6 personal-form-heading">
            {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE')}
          </div>

          <div className="col-xl-6 text-right">
            {
              dirty && !submitting && valid && !disabled &&
              <button className="btn btn-sm btn-primary" type="submit">
                {I18n.t('COMMON.SAVE_CHANGES')}
              </button>
            }
          </div>
        </div>
        <div className="form-row">
          <div className="form-row__small">
            <Field
              name="phoneCode"
              component={SelectField}
              position="vertical"
              label={attributeLabels.phoneCode}
              disabled={disabled}
            >
              <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
              {phoneCodes.map(code => <option key={code} value={code}>+{code}</option>)}
            </Field>
          </div>
          <div className="form-row__big">
            <Field
              name="phone"
              type="text"
              component={InputField}
              showErrorMessage
              label={attributeLabels.phone}
              position="vertical"
              labelAddon={(
                !isPhoneDirty && profile.phoneNumberVerified ?
                  <div className="verification-label color-success font-size-12">
                    <i className="fa fa-check-circle-o" /> {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}
                  </div> : null
              )}
              disabled={disabled}
            />
          </div>
          {
            isPhoneVerifiable &&
            <PermissionContent permissions={permissions.USER_PROFILE.VERIFY_PHONE}>
              <div className="form-row__small form-row__action">
                <button type="button" className="btn btn-success-outline" onClick={this.handleVerifyPhoneClick}>
                  {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY_PHONE')}
                </button>
              </div>
            </PermissionContent>
          }
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
