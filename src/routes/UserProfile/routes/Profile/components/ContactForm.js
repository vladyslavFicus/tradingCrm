import React, { Component, PropTypes } from 'react';
import { InputField } from 'components/ReduxForm/UserProfile';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from '../../../../../utils/validator';

const attributeLabels = {
  phoneNumber: 'Phone',
  email: 'Email',
};

const validator = createValidator({
  email: 'required|email',
  phoneNumber: 'required|phone',
}, attributeLabels, false);

class ContactForm extends Component {
  render() {
    const { pristine, submitting } = this.props;

    return (
      <div>
        <div className="row">
          <h5 className="pull-left">Contacts</h5>
          {
            !(pristine || submitting) &&
            <button className="btn btn-sm btn-primary pull-right" disabled={pristine || submitting} type="submit">
              Save changes
            </button>
          }
        </div>
        <div className="row">
          <form>
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
          </form>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'updateProfileContact',
  validate: validator,
})(ContactForm);
