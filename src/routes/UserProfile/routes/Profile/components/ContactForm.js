import React, { Component, PropTypes } from 'react';
import { InputField } from 'components/ReduxForm/UserProfile';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from 'utils/validator';

const attributeLabels = {
  phoneNumber: 'Phone',
  email: 'Email',
};

const validator = createValidator({
  email: 'required|email',
}, attributeLabels, false);

class ContactForm extends Component {
  render() {
    const {
      pristine,
      submitting,
      handleSubmit,
      onSubmit,
      valid,
    } = this.props;

    return (
      <div>
        <form role="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <h5 className="pull-left">Contacts</h5>
            {
              !(pristine || submitting || !valid) &&
              <button className="btn btn-sm btn-primary pull-right" disabled={pristine || submitting} type="submit">
                Save changes
              </button>
            }
          </div>
          <div className="row">
            <Field
              name="phoneNumber"
              label={attributeLabels.phoneNumber}
              type="text"
              component={InputField}
              wrapperClassName="col-lg-3"
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
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'updateProfileContact',
  validate: validator,
})(ContactForm);
