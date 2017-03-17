import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { InputField, SelectField } from 'components/ReduxForm/UserProfile';
import { createValidator } from 'utils/validator';
import countryList from 'country-list';

const attributeLabels = {
  firstName: 'First name',
  lastName: 'Last name',
  country: 'Country',
};

const countries = countryList().getData().reduce((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});

const validator = createValidator({
  firstName: 'string',
  lastName: 'string',
  country: [`in:,${Object.keys(countries).join()}`],
}, attributeLabels, false);

class OperatorPersonalForm extends Component {
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
              wrapperClassName="col-lg-5"
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

OperatorPersonalForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  pristine: PropTypes.func,
  submitting: PropTypes,bool,
  valid: PropTypes.bool,
};

export default reduxForm({
  form: 'updateOperatorProfilePersonal',
  validate: validator,
})(OperatorPersonalForm);
