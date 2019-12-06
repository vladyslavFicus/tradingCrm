import React, { Fragment } from 'react';
import PropTypes from '../../../../../../../../constants/propTypes';
import PhoneForm from './PhoneForm';
import EmailForm from './EmailForm';

const ContactForm = ({
  disabled,
  profile,
  contactData,
  onSubmit,
  onVerifyPhoneClick,
  onVerifyEmailClick,
}) => (
  <Fragment>
    <PhoneForm
      disabled={disabled}
      profile={profile}
      onSubmit={onSubmit}
      onVerifyPhoneClick={onVerifyPhoneClick}
      initialValues={{
        phone: contactData.phone,
        additionalPhone: contactData.additionalPhone,
      }}
    />
    <EmailForm
      disabled={disabled}
      emailVerified={profile.emailVerified}
      onSubmit={onSubmit}
      onVerifyEmailClick={onVerifyEmailClick}
      initialValues={{
        email: contactData.email,
        additionalEmail: contactData.additionalEmail,
      }}
    />
  </Fragment>
);

ContactForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  profile: PropTypes.userProfile.isRequired,
  contactData: PropTypes.shape({
    phone: PropTypes.string,
    additionalPhone: PropTypes.string,
    email: PropTypes.string,
  }),
  onVerifyPhoneClick: PropTypes.func.isRequired,
  onVerifyEmailClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ContactForm.defaultProps = {
  contactData: {},
  disabled: false,
};

export default ContactForm;
