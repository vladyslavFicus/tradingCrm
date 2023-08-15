import React from 'react';
import QRCode from 'react-qr-code';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { Button, Utils, Routes } from '@crm/common';
import { FormikInputField } from 'components';
import LockedAccount from './components/LockedAccount';
import { ReactComponent as KeyIcon } from './images/key.svg';
import { ReactComponent as MailIcon } from './images/mail.svg';
import { ReactComponent as LockIcon } from './images/lock.svg';
import { ReactComponent as OtpIcon } from './images/otp.svg';
import './SignIn.scss';

const SignIn = () => {
  const {
    formError,
    otpRequired,
    otpSecret,
    showError,
    otpGenerationRequired,
    toggleError,
    handleSubmit,
  } = Routes.SignIn.useSignIn();

  return (
    <div className="SignIn">
      <div className="SignIn__left" />

      <div className="SignIn__right">
        <Choose>
          <When condition={!showError}>
            <Formik
              initialValues={{
                login: '',
                password: '',
              } as Routes.SignIn.FormValues}
              onSubmit={handleSubmit}
              validate={Utils.createValidator({
                login: 'required|email',
                password: 'required|min:6',
              })}
              validateOnBlur={false}
              validateOnChange={false}
            >
              {({ isSubmitting }) => (
                <Form className="SignIn__form">
                  <div className="SignIn__form-header">
                    <KeyIcon className="SignIn__icon-key" />

                    <span>{I18n.t('SIGN_IN.TITLE')}</span>
                  </div>

                  <Field
                    label={I18n.t('SIGN_IN.EMAIL')}
                    disabled={otpGenerationRequired || otpRequired}
                    name="login"
                    type="text"
                    placeholder={I18n.t('SIGN_IN.EMAIL')}
                    component={FormikInputField}
                    addition={<MailIcon />}
                  />

                  <Field
                    disabled={otpGenerationRequired || otpRequired}
                    label={I18n.t('SIGN_IN.PASSWORD')}
                    name="password"
                    type="password"
                    placeholder={I18n.t('SIGN_IN.PASSWORD')}
                    component={FormikInputField}
                    addition={<LockIcon />}
                  />

                  <If condition={otpRequired}>
                    <Field
                      autoFocus
                      name="otp"
                      type="text"
                      label={I18n.t('SIGN_IN.OTP')}
                      placeholder={I18n.t('SIGN_IN.OTP')}
                      component={FormikInputField}
                      addition={<OtpIcon />}
                    />
                  </If>

                  <If condition={!!formError}>
                    <div className="SignIn__form-error">
                      {formError}
                    </div>
                  </If>

                  <If condition={otpGenerationRequired}>
                    <div className="SignIn__qrcode-container">
                      <div className="SignIn__qrcode-title">{I18n.t('SIGN_IN.NEED_REGISTER_ACCOUNT')}</div>

                      <QRCode
                        size={128}
                        value={`otpauth://totp/CRM?secret=${otpSecret}`}
                        bgColor="#000000"
                        fgColor="#FFFFFF"
                        className="SignIn__qrcode"
                      />

                      <div className="SignIn__secret-code">
                        {otpSecret}
                      </div>
                    </div>
                  </If>

                  <Button
                    primary
                    className="SignIn__form-button"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {I18n.t(otpGenerationRequired ? 'SIGN_IN.NEXT' : 'SIGN_IN.LOGIN')}
                  </Button>
                </Form>
              )}
            </Formik>
          </When>

          <Otherwise>
            <LockedAccount
              formError={formError}
              onChange={toggleError}
            />
          </Otherwise>
        </Choose>
      </div>
    </div>
  );
};

export default React.memo(SignIn);
