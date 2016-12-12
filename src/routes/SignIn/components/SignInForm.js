import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from 'utils/validator';
import SignInFormField from './SingInFormField';

const formName = 'signInForm';
const attributeLabels = {
  login: 'Login',
  password: 'Password',
};

const validator = createValidator({
  login: 'required',
  password: 'required|min:6',
}, attributeLabels, false);

class SignInForm extends Component {
  render() {
    const { handleSubmit, pristine, submitting, onSubmit, error, disabled } = this.props;

    return <form
      name="form-validation"
      className="form-horizontal"
      onSubmit={handleSubmit(onSubmit)}
    >
      {error && <div className="alert alert-warning">
        {error}
      </div>}
      <Field
        name="login"
        label={attributeLabels.login}
        type="text"
        component={SignInFormField}
      />
      <Field
        name="password"
        label={attributeLabels.password}
        type="password"
        disabled={disabled}
        component={SignInFormField}
      />

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary width-150"
          disabled={pristine || submitting}
        >
          SIGN IN
        </button>
      </div>
    </form>;
  }
}

export default reduxForm({
  form: formName,
  validate: validator,
})(SignInForm);
