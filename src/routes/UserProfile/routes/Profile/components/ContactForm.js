import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from '../../../../../constants/propTypes';
import { InputField } from '../../../../../components/ReduxForm/UserProfile';
import { createValidator } from '../../../../../utils/validator';

const attributeLabels = {
  phoneNumber: 'Phone',
  email: 'Email',
};

const validator = createValidator({
  email: 'required|email',
}, attributeLabels, false);

class ContactForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
  };

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
            <div className="col-md-6">
              <h5 className="pull-left">Contacts</h5>
            </div>

            <div className="col-md-6 text-right">
              {
                !(pristine || submitting || !valid) &&
                <button className="btn btn-sm btn-primary" type="submit">
                  Save changes
                </button>
              }
            </div>
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
