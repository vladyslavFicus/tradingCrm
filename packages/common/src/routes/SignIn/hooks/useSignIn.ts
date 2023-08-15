import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormikHelpers } from 'formik';
// TODO: add modal
// import ChangeUnauthorizedPasswordModal, {
//   ChangeUnauthorizedPasswordModalProps as ModalProps,
// } from 'modals/ChangeUnauthorizedPasswordModal';
import { parseErrors } from '../../../apollo';
import { useStorage } from '../../../providers';
import { FormValues } from '../types';
import { useSignInMutation } from '../graphql/__generated__/SignInMutation';

const useSignIn = () => {
  const navigate = useNavigate();
  const [signInMutation] = useSignInMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [otpGenerationRequired, setOtpGenerationRequired] = useState<boolean>(false);
  const [otpRequired, setOtpRequired] = useState<boolean>(false);
  const [otpSecret, setOtpSecret] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);

  // ===== Storage ===== //
  const storage = useStorage();

  // ===== Modals ===== //
  // const changeUnauthorizedPasswordModal = useModal<ModalProps>(ChangeUnauthorizedPasswordModal);

  const toggleError = useCallback(() => {
    setShowError(isPrevState => !isPrevState);
    setFormError(null);
  }, []);

  const handleSubmit = useCallback(async (values: FormValues, { setFieldValue }: FormikHelpers<FormValues>) => {
    // Second step handler after OTP Generation Required step
    if (otpGenerationRequired) {
      setOtpGenerationRequired(false);
      setOtpSecret(null);
      setOtpRequired(true);

      return;
    }

    try {
      const signInData = await signInMutation({ variables: values });

      storage.set('token', signInData.data?.auth.signIn?.token);

      navigate('/brands');
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
        // TODO: fix it
        // eslint-disable-next-line no-console
        console.log(setFieldValue);
        // changeUnauthorizedPasswordModal.show({
        //   uuid: error?.errorParameters?.uuid,
        //   onSuccess: () => setFieldValue('password', ''),
        // });

        return;
      }

      if (error.error === 'error.user.locked.by.operator'
      || error.error === 'error.user.locked.failed.sign.in.attempts.exceeded') {
        setShowError(true);
      }

      setFormError(error.message);
    }
  }, [navigate, otpGenerationRequired, signInMutation, storage]);

  return {
    formError,
    otpRequired,
    otpSecret,
    otpGenerationRequired,
    showError,
    handleSubmit,
    toggleError,
  };
};

export default useSignIn;
