import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import { InputField } from '../../../../../../components/ReduxForm';
import { createValidator } from '../../../../../../utils/validator';
import { statuses as playerStatuses } from '../../../../../../constants/user';
import './ContactForm.scss';

const FORM_NAME = 'updateProfileContact';
const attributeLabels = {
  phoneNumber: 'Phone',
  email: 'Email',
};
const validator = createValidator({
  email: 'required|email',
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
      phoneNumber: PropTypes.string,
      email: PropTypes.string,
    }),
    currentValues: PropTypes.shape({
      phoneNumber: PropTypes.string,
      email: PropTypes.string,
    }),
    onVerifyPhoneClick: PropTypes.func.isRequired,
    onVerifyEmailClick: PropTypes.func.isRequired,
  };
  static defaultProps = {
    initialValues: {},
    currentValues: {},
  };

  handleVerifyPhoneClick = () => {
    const { currentValues, onVerifyPhoneClick } = this.props;

    return onVerifyPhoneClick(currentValues.phoneNumber);
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
      initialValues,
      currentValues,
    } = this.props;
    const isPhoneNumberDirty = currentValues.phoneNumber !== initialValues.phoneNumber;

    return (
      <div className="col-xl-8">
        <form role="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row margin-bottom-20">
            <div className="col-xl-6">
              <span className="personal-form-heading">{I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE')}</span>
            </div>

            <div className="col-xl-6 text-right">
              {
                dirty && !submitting && valid &&
                <button className="btn btn-sm btn-primary" type="submit">
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </button>
              }
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6">
              <Field
                name="phoneNumber"
                className="form-group"
                label={attributeLabels.phoneNumber}
                labelAddon={(
                  !isPhoneNumberDirty && profile.phoneNumberVerified &&
                  <div className="verification-label color-success font-size-12">
                    <i className="fa fa-check-circle-o" /> {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}
                  </div>
                )}
                type="text"
                component={InputField}
                position="vertical"
                showErrorMessage
                inputButton={
                  <button className="btn btn-success-outline" onClick={this.handleVerifyPhoneClick}>
                    {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY_PHONE')}
                  </button>
                }
                showInputButton={isPhoneNumberDirty || !profile.phoneNumberVerified}
              />
            </div>
            <div className="col-xl-6">
              <Field
                name="email"
                className="form-group"
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
                  <button className="btn btn-success-outline" onClick={this.handleVerifyEmailClick}>
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
}))(
  reduxForm({
    form: FORM_NAME,
    validate: validator,
  })(ContactForm),
);
