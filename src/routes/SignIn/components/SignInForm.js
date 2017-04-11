import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from '../../../utils/validator';
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
    onSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    departments: PropTypes.arrayOf(PropTypes.dropDownOption),
  };

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      onSubmit,
      error,
      departments,
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
          name="login"
          type="text"
          component={InputField}
          placeholder={attributeLabels.login}
        />
        <Field
          name="password"
          type="password"
          component={InputField}
          placeholder={attributeLabels.password}
        />
        <Field
          name="department"
          placeholder={attributeLabels.department}
          type="text"
          component={SelectField}
        >
          <option value="">-- Choose department --</option>
          {
            departments.map(({ label, value }) => (
              <option key={value} value={value}>
                { renderLabel(label, departmentsLabels) }
              </option>
            ))
          }
        </Field>
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary width-150"
            disabled={pristine || submitting}
          >
            SIGN IN
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
