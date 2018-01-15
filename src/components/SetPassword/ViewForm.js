import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from '../../utils/validator';
import config from '../../config';
import { InputField } from '../../components/ReduxForm';

const formName = 'resetPasswordForm';
const attributeLabels = {
  title: 'Set your password',
  password: 'Password',
  repeatPassword: 'Repeat password',
};

const validator = createValidator({
  password: ['required', 'regex:^.{6,32}$'],
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
      <div className="form-page__form fadeInUp">
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
          <h2>{attributeLabels.title}</h2>
          <div className="form-page__form_input">
            <Field
              name="password"
              label={attributeLabels.password}
              type="password"
              disabled={disabled}
              component={InputField}
              position="vertical"
              placeholder={attributeLabels.password}
            />
          </div>
          <div className="form-page__form_input">
            <Field
              name="repeatPassword"
              label={attributeLabels.repeatPassword}
              type="password"
              disabled={disabled}
              component={InputField}
              position="vertical"
              placeholder={attributeLabels.repeatPassword}
            />
          </div>
          <div className="form-page__form_submit">
            <button
              type="submit"
              className="btn btn-primary form-page_btn"
              disabled={pristine || submitting || disabled || !valid}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: formName,
  validate: validator,
})(ViewForm);
