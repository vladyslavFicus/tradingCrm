import React, { Fragment } from 'react';
import PropTypes from '../../../../../../../../constants/propTypes';
import PhoneForm from './PhoneForm';
import EmailForm from './EmailForm';
import SkypeForm from './SkypeForm';

const ContactForm = ({
  disabled,
  profile,
  contactData,
  onSubmitPhone,
  onSubmitEmail,
  onVerifyPhoneClick,
  onVerifyEmailClick,
}) => (
  <Fragment>
    <PhoneForm
      disabled={disabled}
      profile={profile}
      onSubmit={onSubmitPhone}
      onVerifyPhoneClick={onVerifyPhoneClick}
      initialValues={{
        phone1: contactData.phone1,
        phone2: contactData.phone2,
      }}
    />
    <EmailForm
      disabled={disabled}
      profileStatus={profile.profileStatus}
      onSubmit={onSubmitEmail}
      onVerifyEmailClick={onVerifyEmailClick}
      initialValues={{
        email: contactData.email,
        email2: contactData.email2,
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
    phone1: PropTypes.string,
    phone2: PropTypes.string,
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
