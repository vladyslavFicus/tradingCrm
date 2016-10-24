import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import { InputField } from 'components/ReduxForm';
import { formErrorSelector } from 'utils/redux-form';
import { createValidator } from 'utils/validator';

const formName = 'termsManage';
const errorSelector = formErrorSelector(formName);

const attributeLabels = {
  content: 'Content',
};

const validator = createValidator({
  content: 'required|string',
}, attributeLabels, false);

class ManageForm extends Component {
  constructor(props) {
    super(props);

    this.handleResetForm = this.handleResetForm.bind(this);
  }

  handleResetForm() {
    this.props.reset();
  }

  render() {
    const { handleSubmit, pristine, submitting, onSubmit, disabled } = this.props;

    return <form onSubmit={handleSubmit(onSubmit)}>
      <Field
        name="content"
        label={attributeLabels.priority}
        type="text"
        disabled={disabled}
        component={InputField}
      />

      {!disabled && <div className="form-actions">
        <div className="form-group row">
          <div className="col-md-9 col-md-offset-3">
            <button
              type="submit"
              disabled={submitting}
              className="btn width-150 btn-primary"
            >
              Submit
            </button>

            <button
              type="button"
              disabled={pristine || submitting}
              onClick={this.handleResetForm}
              className="btn btn-default"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>}
    </form>;
  }
}

let ManageReduxForm = reduxForm({
  form: formName,
  validate: validator,
})(ManageForm);
ManageReduxForm = connect((state) => ({
  errors: errorSelector(state),
}), {})(ManageReduxForm);

export default ManageReduxForm;
