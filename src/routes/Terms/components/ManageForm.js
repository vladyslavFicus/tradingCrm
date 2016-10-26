import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { EditorField } from 'components/ReduxForm';
import { createValidator } from 'utils/validator';

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
        label={attributeLabels.content}
        disabled={disabled}
        component={EditorField}
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

export default reduxForm({
  form: 'termsManage',
  validate: validator,
})(ManageForm);
