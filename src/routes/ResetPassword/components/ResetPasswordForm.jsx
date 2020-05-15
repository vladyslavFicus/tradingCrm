import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { FormikInputField } from 'components/Formik';
import { createValidator } from 'utils/validator';

const validator = createValidator({
  password: ['required', 'regex:^((?=.*\\d)(?=.*[a-zA-Z]).{6,16})$'],
  repeatPassword: ['required', 'same:password'],
});

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
