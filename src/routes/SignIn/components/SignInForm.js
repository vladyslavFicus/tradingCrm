import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import { createValidator } from '../../../utils/validator';
import { InputField } from '../../../components/ReduxForm/UserProfile';
import PropTypes from '../../../constants/propTypes';

const attributeLabels = {
  login: 'Login',
  password: 'Password',
  department: 'Department',
};

const validator = createValidator({
  login: 'required',
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
      this.setState({ step: 1 }, () => {
        this.timeouts.push(
          setTimeout(() => {
            this.setState({ step: 2 });
          }, 350)
        );
      });
    }
  }

  componentWillUnmount() {
    if (this.timeouts.length > 0) {
      this.timeouts.forEach(clearTimeout);
    }
  }

  timeouts = [];

  render() {
    const { step } = this.state;
    const {
      handleSubmit,
      pristine,
      submitting,
      onSubmit,
      error,
    } = this.props;
    const className = classNames('sign-in__form', {
      fadeInUp: step === 0,
      fadeOutLeft: step > 0,
      'position-absolute': step > 1,
    });

    return (
      <div className={className}>
        <form
          name="form-validation"
          className="form-horizontal"
          onSubmit={handleSubmit(onSubmit)}
        >
          {
            error &&
            <div className="alert alert-warning">
              {error}
            </div>
          }
          <div className="sign-in__form_input">
            <Field
              name="login"
              type="text"
              label="Email"
              component={InputField}
              placeholder={attributeLabels.login}
            />

          </div>
          <div className="sign-in__form_input">
            <Field
              name="password"
              type="password"
              label="Password"
              component={InputField}
              placeholder={attributeLabels.password}
            />
          </div>
          <div className="sign-in__form_submit">
            <button className="btn btn-primary sign-in_btn" disabled={submitting}>
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
