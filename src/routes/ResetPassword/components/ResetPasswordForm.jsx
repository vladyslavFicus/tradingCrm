import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import {
  passwordPattern,
  passwordMaxSize,
  passwordCustomError,
} from 'constants/operators';
import { FormikInputField } from 'components/Formik';
import { createValidator, translateLabels } from 'utils/validator';

const attributeLabels = {
  password: 'COMMON.PASSWORD',
  repeatPassword: 'COMMON.REPEAT_PASSWORD',
};

const customErrors = {
  'regex.password': passwordCustomError,
};

const validator = createValidator({
  password: ['required', `regex:${passwordPattern}`, `max:${passwordMaxSize}`],
  repeatPassword: ['required', 'same:password'],
}, translateLabels(attributeLabels), false, customErrors);

class ResetPasswordForm extends Component {
  static propTypes = {
    hasSubmittedForm: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    formError: PropTypes.string,
  }

  static defaultProps = {
    formError: '',
  }

  state = {
    startAnimation: false,
  }

  componentDidMount() {
    this.setState({ startAnimation: true });
  }

  render() {
    const { onSubmit, formError, hasSubmittedForm } = this.props;
    const { startAnimation } = this.state;

    return (
      <Choose>
        <When condition={hasSubmittedForm}>
          <div className="auth__form fadeInUp">
            <div className="auth__form-title">
              {I18n.t('RESET_PASSWORD.PASSWORD_SETTLED')}
            </div>
            <div className="text-center">
              <Link className="btn btn-primary auth__form-button" to="/logout">
                {I18n.t('RESET_PASSWORD.LOGIN')}
              </Link>
            </div>
          </div>
        </When>
        <Otherwise>
          <CSSTransition classNames="auth__form" in={startAnimation} timeout={300}>
            <Formik
              initialValues={{ password: '', repeatPassword: '' }}
              onSubmit={onSubmit}
              validate={validator}
            >
              {({ isSubmitting }) => (
                <Form className="auth__form">
                  <div className="auth__form-title">
                    {I18n.t('RESET_PASSWORD.TITLE')}
                  </div>

                  <If condition={formError}>
                    <div className="alert alert-warning">
                      {formError}
                    </div>
                  </If>
                  <Field
                    name="password"
                    type="password"
                    placeholder={I18n.t('RESET_PASSWORD.PASSWORD')}
                    label={I18n.t('RESET_PASSWORD.PASSWORD')}
                    component={FormikInputField}
                  />
                  <Field
                    name="repeatPassword"
                    type="password"
                    placeholder={I18n.t('RESET_PASSWORD.REPEAT_PASSWORD')}
                    label={I18n.t('RESET_PASSWORD.REPEAT_PASSWORD')}
                    component={FormikInputField}
                  />
                  <div className="auth__form-buttons">
                    <button
                      type="submit"
                      id="set-password-submit-button"
                      className="auth__form-button"
                      disabled={isSubmitting}
                    >
                      {I18n.t('COMMON.SUBMIT')}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </CSSTransition>
        </Otherwise>
      </Choose>
    );
  }
}

export default ResetPasswordForm;
