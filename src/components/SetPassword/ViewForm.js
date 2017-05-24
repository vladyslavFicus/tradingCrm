import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import FormField from './FormField';
import { createValidator } from 'utils/validator';
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
  static propTypes = {
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      onSubmit,
      error,
      disabled,
      valid,
    } = this.props;

    return (
      <form
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
            disabled={pristine || submitting || disabled || !valid}
          >
            Submit
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: formName,
  validate: validator,
})(ViewForm);
