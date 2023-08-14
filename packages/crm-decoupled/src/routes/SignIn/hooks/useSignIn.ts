import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormikHelpers } from 'formik';
import { parseErrors, useModal, useStorage } from '@crm/common';
import ChangeUnauthorizedPasswordModal, {
  ChangeUnauthorizedPasswordModalProps as ModalProps,
} from 'modals/ChangeUnauthorizedPasswordModal';
import { FormValues } from '../types/signIn';
import { useSignInMutation } from '../graphql/__generated__/SignInMutation';

const useSignIn = () => {
  const navigate = useNavigate();
  const [signInMutation] = useSignInMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [otpGenerationRequired, setOtpGenerationRequired] = useState<boolean>(false);
  const [otpRequired, setOtpRequired] = useState<boolean>(false);
  const [otpSecret, setOtpSecret] = useState<string | null>(null);

  // ===== Storage ===== //
  const storage = useStorage();

  // ===== Modals ===== //
  const changeUnauthorizedPasswordModal = useModal<ModalProps>(ChangeUnauthorizedPasswordModal);

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
        changeUnauthorizedPasswordModal.show({
          uuid: error?.errorParameters?.uuid,
          onSuccess: () => setFieldValue('password', ''),
        });

        return;
      }

      setFormError(error.message);
    }
  }, [otpGenerationRequired]);

  return {
    formError,
    otpRequired,
    otpSecret,
    otpGenerationRequired,
    handleSubmit,
  };
};

export default useSignIn;
