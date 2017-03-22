import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { InputField, SelectField } from 'components/ReduxForm/UserProfile';
import { createValidator } from 'utils/validator';
import countryList from 'country-list';

const attributeLabels = {
  firstName: 'First name',
  lastName: 'Last name',
  country: 'Country',
  phoneNumber: 'Phone',
  email: 'Email',
};

const countries = countryList().getData().reduce((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});

const validator = createValidator({
  firstName: ['required', 'string'],
  lastName: ['required', 'string'],
  email: ['required', 'email'],
  country: [`in:,${Object.keys(countries).join()}`],
  phoneNumber: 'string',
}, attributeLabels, false);

class Form extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      valid,
    } = this.props;

    return (
      <div>
        <form className="form-horizontal" role="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <h5 className="pull-left">Personal information</h5>
            { !(pristine || submitting || !valid) &&
            <button className="btn btn-sm btn-primary pull-right" type="submit">
              Save changes
            </button>
            }
          </div>
          <div className="row">
            <Field
              name="firstName"
              label={attributeLabels.firstName}
              type="text"
              component={InputField}
              wrapperClassName="col-lg-4"
              showErrorMessage
            />
            <Field
              name="lastName"
              label={attributeLabels.lastName}
              type="text"
              component={InputField}
              wrapperClassName="col-lg-4"
              showErrorMessage
            />
            <Field
              name="email"
              label={attributeLabels.email}
              type="text"
              component={InputField}
              wrapperClassName="col-lg-4"
              showErrorMessage
            />
          </div>
          <hr />
          <div className="row">
            <h5 className="pull-left">Contacts</h5>
          </div>
          <div className="row">
            <Field
              name="phoneNumber"
              label={attributeLabels.phoneNumber}
              type="text"
              component={InputField}
              wrapperClassName="col-lg-4"
              showErrorMessage
            />
            <Field
              name="country"
              label={attributeLabels.country}
              type="text"
              wrapperClassName="col-lg-4"
              component={SelectField}
            >
              {Object
                .keys(countries)
                .map((key) => <option key={key} value={key}>{countries[key]}</option>)
              }
            </Field>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'updateOperatorProfilePersonal',
  validate: validator,
})(Form);
