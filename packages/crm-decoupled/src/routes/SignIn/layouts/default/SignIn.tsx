import React from 'react';
import QRCode from 'react-qr-code';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { Config, Utils } from '@crm/common';
import { Button, FormikInputField } from 'components';
import Copyrights from 'components/Copyrights';
import { FormValues } from 'routes/SignIn/types/signIn';
import useSignIn from 'routes/SignIn/hooks/useSignIn';
import './SignIn.scss';

const SignIn = () => {
  const {
    formError,
    otpRequired,
    otpSecret,
    handleSubmit,
    otpGenerationRequired,
  } = useSignIn();

  return (
    <div className="SignIn">
      <div className="SignIn__logo">
        <img
          alt="logo"
          src={Config.getCrmBrandStaticFileUrl('assets/logo.svg')}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <Formik
        initialValues={{
          login: '',
          password: '',
        } as FormValues}
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
            <If condition={!!formError}>
              <div className="SignIn__form-error">
                {formError}
              </div>
            </If>

            <div className="SignIn__form-fields">
              <Field
                className="SignIn__field"
                disabled={otpGenerationRequired || otpRequired}
                name="login"
                type="email"
                placeholder={I18n.t('SIGN_IN.EMAIL')}
                component={FormikInputField}
              />

              <Field
                disabled={otpGenerationRequired || otpRequired}
                name="password"
                type="password"
                placeholder={I18n.t('SIGN_IN.PASSWORD')}
                component={FormikInputField}
              />

              <If condition={otpRequired}>
                <Field
                  autoFocus
                  name="otp"
                  type="text"
                  placeholder={I18n.t('SIGN_IN.OTP')}
                  component={FormikInputField}
                />
              </If>
            </div>

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

            <div className="SignIn__form-buttons">
              <Button
                primary
                className="SignIn__form-button"
                disabled={isSubmitting}
                type="submit"
              >
                {I18n.t(otpGenerationRequired ? 'SIGN_IN.NEXT' : 'SIGN_IN.LOGIN')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <Copyrights />
    </div>
  );
};

export default React.memo(SignIn);
