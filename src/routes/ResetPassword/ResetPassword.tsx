import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { parse } from 'qs';
import { parseErrors } from 'apollo';
import { getCrmBrandStaticFileUrl } from 'config';
import { createValidator, translateLabels } from 'utils/validator';
import { passwordPattern, passwordMaxSize, passwordCustomError } from 'constants/operators';
import { Button } from 'components/UI';
import Copyrights from 'components/Copyrights';
import { FormikInputField } from 'components/Formik';
import { useResetPasswordMutation } from './graphql/__generated__/ResetPasswordMutation';
import './ResetPassword.scss';

const attributeLabels = {
  password: 'COMMON.PASSWORD',
  repeatPassword: 'COMMON.REPEAT_PASSWORD',
};

type FormValues = {
  password: string,
  repeatPassword: string,
};

type QueryParams = {
  token: string,
};

const ResetPassword = () => {
  const history = useHistory();
  const { search } = useLocation();
  const { token } = parse(search, { ignoreQueryPrefix: true }) as QueryParams;

  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccessSubmit, setIsSuccessSubmit] = useState<boolean>(false);

  // ===== Requests ===== //
  const [resetPassword] = useResetPasswordMutation();

  // ===== Handlers ===== //
  const handleSubmit = async ({ password }: FormValues) => {
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
  };


  return (
    <div className="ResetPassword">
      <div className="ResetPassword__logo">
        <img
          alt="logo"
          src={getCrmBrandStaticFileUrl('assets/logo.svg')}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <Choose>
        <When condition={isSuccessSubmit}>
          <div className="ResetPassword__form">
            <div className="ResetPassword__form-title">
              {I18n.t('RESET_PASSWORD.PASSWORD_SETTLED')}
            </div>
            <Button
              primary
              className="ResetPassword__form-button"
              onClick={() => history.push('/logout')}
            >
              {I18n.t('RESET_PASSWORD.LOGIN')}
            </Button>
          </div>
        </When>

        <Otherwise>
          <Formik
            initialValues={{ password: '', repeatPassword: '' }}
            onSubmit={handleSubmit}
            validateOnBlur={false}
            validateOnChange={false}
            validate={createValidator({
              password: ['required', `regex:${passwordPattern}`, `max:${passwordMaxSize}`],
              repeatPassword: ['required', 'same:password'],
            }, translateLabels(attributeLabels), false, { 'regex.password': passwordCustomError })}
          >
            {({ isSubmitting }) => (
              <Form className="ResetPassword__form">
                <div className="ResetPassword__form-title">
                  {I18n.t('RESET_PASSWORD.TITLE')}
                </div>

                <If condition={!!formError}>
                  <div className="ResetPassword__error">
                    {formError}
                  </div>
                </If>

                <Field
                  name="password"
                  type="password"
                  placeholder={I18n.t('RESET_PASSWORD.PASSWORD')}
                  component={FormikInputField}
                />

                <Field
                  name="repeatPassword"
                  type="password"
                  placeholder={I18n.t('RESET_PASSWORD.REPEAT_PASSWORD')}
                  component={FormikInputField}
                />

                <div className="ResetPassword__form-buttons">
                  <Button
                    primary
                    type="submit"
                    className="ResetPassword__form-button"
                    disabled={isSubmitting}
                  >
                    {I18n.t('COMMON.SUBMIT')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Otherwise>
      </Choose>

      <Copyrights />
    </div>
  );
};

export default React.memo(ResetPassword);
