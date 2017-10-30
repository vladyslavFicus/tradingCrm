import React, { Component } from 'react';
import PropTypes from '../../../../../../constants/propTypes';
import './ContactForm.scss';
import PhoneForm from './PhoneForm';
import EmailForm from './EmailForm';

class ContactForm extends Component {
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
    fetchMeta: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    contactData: {},
    disabled: false,
  };

  componentDidMount() {
    this.props.fetchMeta();
  }

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
      <div className="col-md-12">
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
