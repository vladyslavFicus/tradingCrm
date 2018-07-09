import React, { Fragment } from 'react';
import PropTypes from '../../../../../../../../constants/propTypes';
import PhoneForm from './PhoneForm';
import EmailForm from './EmailForm';
import SkypeForm from './SkypeForm';

const ContactForm = ({
  disabled,
  profile,
  contactData,
  phoneCodes,
  onSubmitPhone,
  onSubmitEmail,
  onVerifyPhoneClick,
  onVerifyEmailClick,
}) => (
  <Fragment>
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
    <EmailForm
      disabled={disabled}
      profileStatus={profile.profileStatus}
      onSubmit={onSubmitEmail}
      onVerifyEmailClick={onVerifyEmailClick}
      initialValues={{
        email: contactData.email,
      }}
    />
    <SkypeForm
      disabled={disabled}
      onSubmit={onSubmitEmail}
    />
  </Fragment>
);

ContactForm.propTypes = {
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

ContactForm.defaultProps = {
  contactData: {},
  disabled: false,
};

export default ContactForm;
