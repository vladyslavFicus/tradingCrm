import React, { PureComponent } from 'react';
import PropTypes from '../../../../../../../../constants/propTypes';
import PhoneForm from './PhoneForm';
import EmailForm from './EmailForm';

class ContactForm extends PureComponent {
  static propTypes = {
    onSubmitPhone: PropTypes.func.isRequired,
    onSubmitEmail: PropTypes.func.isRequired,
    profile: PropTypes.userProfile.isRequired,
    contactData: PropTypes.shape({
      phoneCode: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
    }),
    phoneCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onVerifyPhoneClick: PropTypes.func.isRequired,
    onVerifyEmailClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    contactData: {},
    disabled: false,
  };

  render() {
    const {
      disabled,
      profile,
      contactData,
      phoneCodes,
      onSubmitPhone,
      onSubmitEmail,
      onVerifyPhoneClick,
      onVerifyEmailClick,
    } = this.props;

    return (
      <div>
        <PhoneForm
          disabled={disabled}
          profile={profile}
          phoneCodes={phoneCodes}
          onSubmit={onSubmitPhone}
          onVerifyPhoneClick={onVerifyPhoneClick}
          initialValues={{
            phone: contactData.phone,
            phoneCode: contactData.phoneCode,
          }}
        />
        <hr />
        <EmailForm
          disabled={disabled}
          profileStatus={profile.profileStatus}
          onSubmit={onSubmitEmail}
          onVerifyEmailClick={onVerifyEmailClick}
          initialValues={{
            email: contactData.email,
          }}
        />
      </div>
    );
  }
}

export default ContactForm;
