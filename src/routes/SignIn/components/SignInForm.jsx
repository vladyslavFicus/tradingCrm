import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { FormikInputField } from 'components/Formik';
import { createValidator } from 'utils/validator';

const validator = createValidator({
  login: 'required|email',
  password: 'required|min:6',
});

class SignInForm extends Component {
  static propTypes = {
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
    const { onSubmit, formError } = this.props;
    const { startAnimation } = this.state;

    return (
      <CSSTransition classNames="auth__form" in={startAnimation} timeout={300}>
        <Formik
          initialValues={{ login: '', password: '' }}
          onSubmit={onSubmit}
          validate={validator}
        >
          {({ isSubmitting }) => (
            <Form className="auth__form">
              <If condition={formError}>
                <div className="alert alert-warning">
                  {formError}
                </div>
              </If>
              <Field
                name="login"
                type="email"
                placeholder={I18n.t('SIGN_IN.EMAIL')}
                label={I18n.t('SIGN_IN.EMAIL')}
                component={FormikInputField}
              />
              <Field
                name="password"
                type="password"
                placeholder={I18n.t('SIGN_IN.PASSWORD')}
                label={I18n.t('SIGN_IN.PASSWORD')}
                component={FormikInputField}
              />
              <div className="auth__form-buttons">
                <button
                  type="submit"
                  id="sign-in-submit-button"
                  className="btn btn-primary auth__form-button"
                  disabled={isSubmitting}
                >
                  {I18n.t('SIGN_IN.LOGIN')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CSSTransition>
    );
  }
}

export default SignInForm;
