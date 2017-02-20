import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { InputField, SingleDateField, SelectField } from 'components/ReduxForm/UserProfile';
import { createValidator } from 'utils/validator';

const genders = ['male', 'female'];

const attributeLabels = {
  firstName: 'First name',
  lastName: 'Last name',
  identifier: 'ID Number',
  birthDate: 'Date of birth',
  gender: 'Gender',
};

const validator = createValidator({
  firstName: 'string',
  lastName: 'string',
  birthDate: 'required|date',
}, attributeLabels, false);

class PersonalForm extends Component {
  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
    } = this.props;

    return (
      <div>
        <form className="form-horizontal" role="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <h5 className="pull-left">Personal information</h5>
            { !(pristine || submitting) &&
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
              name="identifier"
              label={attributeLabels.identifier}
              type="text"
              component={InputField}
              wrapperClassName="col-lg-5"
              showErrorMessage
            />

            <Field
              name="birthDate"
              label={attributeLabels.birthDate}
              wrapperClassName="col-lg-4"
              component={SingleDateField}
            />

            <Field
              name="gender"
              label={attributeLabels.gender}
              type="text"
              wrapperClassName="col-lg-3"
              component={SelectField}
            >
              <option value="">None</option>
              {genders.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'updateProfilePersonal',
  validate: validator,
})(PersonalForm);
