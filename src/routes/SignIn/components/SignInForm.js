import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import { createValidator } from '../../../utils/validator';
import { InputField } from '../../../components/ReduxForm';
import PropTypes from '../../../constants/propTypes';

const attributeLabels = {
  email: 'Email',
  password: 'Password',
  department: 'Department',
};

const validator = createValidator({
  email: 'required',
  password: 'required|min:6',
  department: 'required',
}, attributeLabels, false);

class SignInForm extends Component {
  static propTypes = {
    logged: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    error: PropTypes.string,
  };
  static defaultProps = {
    handleSubmit: null,
    submitting: false,
    pristine: false,
    error: null,
  };

  state = {
    step: 0,
  };

  componentWillReceiveProps(nextProps) {
    const { logged } = this.props;

    if (logged !== nextProps.logged) {
      if (nextProps.logged) {
        this.setState({ step: 1 }, () => {
          this.timeouts.push(
            setTimeout(() => {
              this.setState({ step: 2 });
            }, 350)
          );
        });
      } else {
        this.setState({ step: 0 });
      }
    }
  }

  componentWillUnmount() {
    if (this.timeouts.length > 0) {
      this.timeouts.map(clearTimeout);
    }
  }

  timeouts = [];

  handleSubmit = (data) => {
    console.info('Sign in data submitted.');

    return this.props.onSubmit(data);
  };

  render() {
    const { step } = this.state;
    const {
      handleSubmit,
      submitting,
      error,
    } = this.props;
    const className = classNames('form-page__form', {
      fadeInUp: step === 0,
      fadeOutLeft: step > 0,
      'position-absolute': step > 1,
    });

    return (
      <div className={className}>
        <form
          name="form-validation"
          className="form-horizontal"
          onSubmit={handleSubmit(this.handleSubmit)}
        >
          {
            error &&
            <div className="alert alert-warning">
              {error}
            </div>
          }
          <div className="form-page__form_input">
            <Field
              id="sign-in-email-field"
              name="login"
              type="text"
              label="Email"
              component={InputField}
              position="vertical"
              placeholder={attributeLabels.email}
            />

          </div>
          <div className="form-page__form_input">
            <Field
              id="sign-in-password-field"
              name="password"
              type="password"
              label="Password"
              component={InputField}
              position="vertical"
              placeholder={attributeLabels.password}
            />
          </div>
          <div className="form-page__form_submit">
            <button
              id="sign-in-submit-button"
              className="btn btn-primary form-page_btn"
              disabled={submitting}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'signInForm',
  validate: validator,
})(SignInForm);
