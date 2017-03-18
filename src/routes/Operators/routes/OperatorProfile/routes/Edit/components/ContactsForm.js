import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { InputField, SelectField } from 'components/ReduxForm/UserProfile';
import { createValidator } from 'utils/validator';

const attributeLabels = {
  phone: 'Phone',
  email: 'Email',
};

const validator = createValidator({
  phone: 'string',
  email: 'string',
}, attributeLabels, false);

class ContactsForm extends Component {
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
            <h5 className="pull-left">Contacts</h5>
            { !(pristine || submitting || !valid) &&
            <button className="btn btn-sm btn-primary pull-right" type="submit">
              Save changes
            </button>
            }
          </div>
          <div className="row">
            <Field
              name="phone"
              label={attributeLabels.phone}
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
              wrapperClassName="col-lg-5"
              showErrorMessage
            />
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'updateOperatorProfileContacts',
  validate: validator,
})(ContactsForm);
