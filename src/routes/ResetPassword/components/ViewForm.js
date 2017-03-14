import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from 'utils/validator';
import FormField from './FormField';
import config from 'config/index';

const formName = 'resetPasswordForm';
const attributeLabels = {
  password: 'Password',
  repeatPassword: 'Repeat password',
};

const validator = createValidator({
  password: ['required', `regex:${config.nas.validation.password}`],
  repeatPassword: [
    'required',
    'same:password',
  ],
}, attributeLabels, false);

class ViewForm extends Component {
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
        name="password"
        label={attributeLabels.password}
        type="password"
        disabled={disabled}
        component={FormField}
      />
      <Field
        name="repeatPassword"
        label={attributeLabels.repeatPassword}
        type="password"
        disabled={disabled}
        component={FormField}
      />

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary width-150 text-uppercase"
          disabled={pristine || submitting || disabled}
        >
          Set new password
        </button>
      </div>
    </form>;
  }
}

export default reduxForm({
  form: formName,
  validate: validator,
})(ViewForm);
