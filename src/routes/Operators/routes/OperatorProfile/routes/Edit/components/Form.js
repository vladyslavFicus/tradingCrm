import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import countryList from 'country-list';
import { InputField, SelectField } from '../../../../../../../components/ReduxForm';
import { createValidator } from '../../../../../../../utils/validator';

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
  country: ['required', `in:,${Object.keys(countries).join()}`],
  phoneNumber: 'string',
}, attributeLabels, false);

class Form extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  };
  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col-xl-6">
            <span className="personal-form-heading">Personal information</span>
          </div>
          {!(pristine || submitting) &&
          <div className="col-xl-6 text-right">
            <button className="btn btn-sm btn-primary pull-right" type="submit">
              Save changes
            </button>
          </div>
          }
        </div>
        <div className="row">
          <div className="col-xl-4">
            <Field
              name="firstName"
              label={attributeLabels.firstName}
              type="text"
              component={InputField}
              showErrorMessage
              position="vertical"
            />
          </div>
          <div className="col-xl-4">
            <Field
              name="lastName"
              label={attributeLabels.lastName}
              type="text"
              component={InputField}
              showErrorMessage
              position="vertical"
            />
          </div>
          <div className="col-xl-4">
            <Field
              name="email"
              label={attributeLabels.email}
              type="text"
              disabled
              component={InputField}
              showErrorMessage
              position="vertical"
            />
          </div>
        </div>
        <hr />
        <div className="personal-form-heading margin-bottom-20">Contacts</div>
        <div className="row">
          <div className="col-xl-4">
            <Field
              name="phoneNumber"
              label={attributeLabels.phoneNumber}
              type="text"
              component={InputField}
              showErrorMessage
              position="vertical"
            />
          </div>
          <div className="col-xl-4">
            <Field
              name="country"
              label={attributeLabels.country}
              type="text"
              component={SelectField}
              position="vertical"
            >
              <option value="">-- Select country --</option>
              {Object
                .keys(countries)
                .map(key => <option key={key} value={key}>{countries[key]}</option>)
              }
            </Field>
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'updateOperatorProfilePersonal',
  validate: validator,
  enableReinitialize: true,
})(Form);
