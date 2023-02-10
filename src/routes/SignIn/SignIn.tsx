import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { useHistory } from 'react-router-dom';
import compose from 'compose-function';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { getCrmBrandStaticFileUrl } from 'config';
import { withModals } from 'hoc';
import { parseErrors } from 'apollo';
import { Modal } from 'types';
import { Storage } from 'types/storage';
import { withStorage } from 'providers/StorageProvider';
import { Button } from 'components/Buttons';
import Copyrights from 'components/Copyrights';
import ChangeUnauthorizedPasswordModal from 'modals/ChangeUnauthorizedPasswordModal';
import { FormikInputField } from 'components/Formik';
import { createValidator } from 'utils/validator';
import { useSignInMutation } from './graphql/__generated__/SignInMutation';
import './SignIn.scss';

type Props = {
  modals: {
    changeUnauthorizedPasswordModal: Modal,
  },
  storage: Storage,
};

 type FormValues = {
  login: string,
  password: string,
  otp: string | null,
};

const SignIn = (props: Props) => {
  const history = useHistory();
  const [signInMutation] = useSignInMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [otpGenerationRequired, setOtpGenerationRequired] = useState<boolean>(false);
  const [otpRequired, setOtpRequired] = useState<boolean>(false);
  const [otpSecret, setOtpSecret] = useState<string | null>(null);

  const handleSubmit = async (values: FormValues, { setFieldValue }: FormikHelpers<FormValues>) => {
    const {
      storage,
      modals: { changeUnauthorizedPasswordModal },
    } = props;

    // Second step handler after OTP Generation Required step
    if (otpGenerationRequired) {
      setOtpGenerationRequired(false);
      setOtpSecret(null);
      setOtpRequired(true);

      return;
    }

    try {
      const signInData = await signInMutation({ variables: values });
      const { token } = get(signInData, 'data.auth.signIn') || {};

      storage.set('token', token);

      history.push('/brands');
    } catch (e) {
      const error = parseErrors(e);

      // Show OTP generation step
      if (error.error === 'error.validation.otp.initialization.required') {
        setOtpGenerationRequired(true);
        setOtpSecret(error.errorParameters['otp.secret']);

        return;
      }

      // Show OTP validation step
      if (error.error === 'error.validation.otp.required') {
        setOtpRequired(true);

        return;
      }

      if (error.error === 'error.user.locked.password.expired') {
        changeUnauthorizedPasswordModal.show({
          uuid: error?.errorParameters?.uuid,
          onSuccess: () => setFieldValue('password', ''),
        });

        return;
      }

      setFormError(error.message);
    }
  };

  return (
    <div className="SignIn">
      <div className="SignIn__logo">
        <img
          alt="logo"
          src={getCrmBrandStaticFileUrl('assets/logo.svg')}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <Formik
        initialValues={{
          login: '',
          password: '',
        } as FormValues}
        onSubmit={handleSubmit}
        validate={createValidator({
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

export default compose(
  React.memo,
  withStorage,
  withModals({
    changeUnauthorizedPasswordModal: ChangeUnauthorizedPasswordModal,
  }),
)(SignIn);
