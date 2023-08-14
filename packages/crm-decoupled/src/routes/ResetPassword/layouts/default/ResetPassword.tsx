import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Config, Utils, Constants } from '@crm/common';
import { Button } from 'components';
import { FormikInputField } from 'components/Formik';
import Copyrights from 'components/Copyrights';
import { attributeLabels } from 'routes/ResetPassword/constants/resetPassword';
import useResetPassword from 'routes/ResetPassword/hooks/useResetPassword';
import './ResetPassword.scss';

const ResetPassword = () => {
  const {
    navigate,
    formError,
    isSuccessSubmit,
    handleSubmit,
  } = useResetPassword();

  return (
    <div className="ResetPassword">
      <div className="ResetPassword__logo">
        <img
          alt="logo"
          src={Config.getCrmBrandStaticFileUrl('assets/logo.svg')}
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
              onClick={() => navigate('/logout')}
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
            validate={Utils.createValidator({
              password: [
                'required',
                `regex:${Constants.Operator.passwordPattern}`,
                `max:${Constants.Operator.passwordMaxSize}`,
              ],
              repeatPassword: ['required', 'same:password'],
            },
            Utils.translateLabels(attributeLabels),
            false,
            { 'regex.password': Constants.Operator.passwordCustomError })}
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
                  autocomplete="new-password"
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
