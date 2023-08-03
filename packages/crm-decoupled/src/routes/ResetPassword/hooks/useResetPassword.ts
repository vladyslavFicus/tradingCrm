import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { parse } from 'qs';
import { parseErrors } from 'apollo';
import { useResetPasswordMutation } from '../graphql/__generated__/ResetPasswordMutation';

type FormValues = {
  password: string,
  repeatPassword: string,
};

type QueryParams = {
  token: string,
};

const useResetPassword = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { token } = parse(search, { ignoreQueryPrefix: true }) as QueryParams;

  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccessSubmit, setIsSuccessSubmit] = useState<boolean>(false);

  // ===== Requests ===== //
  const [resetPassword] = useResetPasswordMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async ({ password }: FormValues) => {
    setFormError(null);

    try {
      await resetPassword({ variables: { password, token } });

      setIsSuccessSubmit(true);
    } catch (e) {
      const error = parseErrors(e);

      setFormError(
        error.error === 'error.entity.not.found'
          ? I18n.t('RESET_PASSWORD.ERRORS.REQUEST_NOT_FOUND')
          : error.message,
      );
    }
  }, [token]);


  return {
    navigate,
    formError,
    isSuccessSubmit,
    handleSubmit,
  };
};

export default useResetPassword;
