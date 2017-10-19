import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, getFormSyncErrors, getFormValues } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import { InputField, SelectField } from '../../../../../../components/ReduxForm';
import { createValidator } from '../../../../../../utils/validator';
import { statuses as playerStatuses } from '../../../../../../constants/user';
import './ContactForm.scss';

const FORM_NAME = 'updateProfileContact';

const attributeLabels = {
  phone: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.PHONE'),
  phoneCode: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.LABEL.PHONE_CODE'),
  email: I18n.t('COMMON.EMAIL'),
};

const validator = createValidator({
  email: 'required|email',
  phone: 'required|numeric',
  phoneCode: 'required|numeric',
}, attributeLabels, false);

class ContactForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    dirty: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    profile: PropTypes.userProfile,
    initialValues: PropTypes.shape({
      phoneCode: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
    }),
    currentValues: PropTypes.shape({
      phoneCode: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
    }),
    phoneCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onVerifyPhoneClick: PropTypes.func.isRequired,
    onVerifyEmailClick: PropTypes.func.isRequired,
    fetchMeta: PropTypes.func.isRequired,
    formSyncErrors: PropTypes.object,
  };
  static defaultProps = {
    handleSubmit: null,
    initialValues: {},
    currentValues: {},
    formSyncErrors: {},
  };

  componentDidMount() {
    this.props.fetchMeta();
  }

  handleVerifyPhoneClick = () => {
    const { currentValues, onVerifyPhoneClick } = this.props;

    return onVerifyPhoneClick(currentValues.phone, currentValues.phoneCode);
  };

  handleVerifyEmailClick = () => {
    const { currentValues, onVerifyEmailClick } = this.props;

    return onVerifyEmailClick(currentValues.email);
  };

  render() {
    const {
      dirty,
      submitting,
      handleSubmit,
      onSubmit,
      valid,
      profile,
      phoneCodes,
      initialValues,
      currentValues,
      formSyncErrors,
    } = this.props;
    const isPhoneDirty = currentValues.phone !== initialValues.phone ||
      currentValues.phoneCode !== initialValues.phoneCode;

    const isPhoneValid = !formSyncErrors.phone && !formSyncErrors.phoneCode;
    const isPhoneVerifiable = isPhoneValid && (isPhoneDirty || !profile.phoneNumberVerified);

    return (
      <div className="col-md-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row margin-bottom-20">
            <div className="col-md-6">
              <span className="personal-form-heading">{I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE')}</span>
            </div>

            <div className="col-md-6 text-right">
              {
                dirty && !submitting && valid &&
                <button className="btn btn-sm btn-primary" type="submit">
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </button>
              }
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="col-md-3">
                <Field
                  name="phoneCode"
                  component={SelectField}
                  position="vertical"
                  label={attributeLabels.phoneCode}
                  className="form-control"
                >
                  <option value="">{I18n.t('COMMON.SELECT_OPTION')}</option>
                  {phoneCodes.map(code => <option key={code} value={code}>+{code}</option>)}
                </Field>
              </div>
              <div className="col-md-9">
                <Field
                  name="phone"
                  type="text"
                  className="form-group player-profile__contact-input"
                  component={InputField}
                  showErrorMessage
                  label={attributeLabels.phone}
                  position="vertical"
                  showInputButton={isPhoneVerifiable}
                  labelAddon={(
                    !isPhoneDirty && profile.phoneNumberVerified &&
                    <div className="verification-label color-success font-size-12">
                      <i className="fa fa-check-circle-o" /> {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}
                    </div>
                  )}
                  inputButton={
                    <button type="button" className="btn btn-success-outline" onClick={this.handleVerifyPhoneClick}>
                      {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY_PHONE')}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="col-md-4">
              <Field
                name="email"
                className="form-group player-profile__contact-input"
                label={attributeLabels.email}
                labelAddon={(
                  profile.profileStatus !== playerStatuses.INACTIVE &&
                  <div className="verification-label color-success font-size-12">
                    <i className="fa fa-check-circle-o" /> {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}
                  </div>
                )}
                type="text"
                component={InputField}
                position="vertical"
                disabled
                showErrorMessage
                inputButton={
                  <button type="button" className="btn btn-success-outline" onClick={this.handleVerifyEmailClick}>
                    {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY_EMAIL')}
                  </button>
                }
                showInputButton={profile.profileStatus === playerStatuses.INACTIVE}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
  formSyncErrors: getFormSyncErrors(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: validator,
    enableReinitialize: true,
  })(ContactForm),
);
