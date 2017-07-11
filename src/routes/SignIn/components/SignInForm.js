import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from '../../../utils/validator';
import classNames from 'classnames';
import { departmentsLabels } from '../../../constants/operators';
import { SelectField, InputField } from '../../../components/ReduxForm/UserProfile';
import { renderLabel } from '../../../routes/Operators/utils';
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

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      onSubmit,
      error,
    } = this.props;

    return (
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
            component={InputField}
            placeholder={attributeLabels.password}
          />
        </div>
        <div className="sign-in__form_submit">
          <button className="btn btn-primary sign-in_btn" disabled={pristine || submitting}>
            Login
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'signInForm',
  validate: validator,
})(SignInForm);
