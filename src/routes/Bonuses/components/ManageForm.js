import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import { InputField, SingleDateField } from 'components/ReduxForm';
import { renderField, renderError, formErrorSelector } from 'utils/redux-form';
import { stopEvent } from 'utils/helpers';
import { createValidator } from 'utils/validator';

const formName = 'bonusManage';
const errorSelector = formErrorSelector(formName);

const attributeLabels = {
  playerUUID: 'Player UUID',
  label: 'Name',
  priority: 'Priority',
  state: 'State',
  grantedAmount: 'Granted amount',
  amountToWage: 'Amount to wage',
  createdDate: 'Created date',
  expirationDate: 'Expiration date',
  prize: 'Prize',
  capping: 'Capping',
  optIn: 'Opt-in',
  converted: 'Converted',
  wagered: 'Wagered',
};

const validator = createValidator({
  playerUUID: 'required|string',
  label: 'required|string',
  priority: 'required|numeric|min:0',
  grantedAmount: 'required|numeric|min:0',
  amountToWage: 'required|numeric|min:0',
  createdDate: 'required',
  expirationDate: 'required',
  prize: 'required_if:capping|numeric|min:0',
  capping: 'numeric|required_if:prize|min:0',
  optIn: 'required|boolean',
  converted: 'required',
  wagered: 'required',
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
      {disabled && <div className="alert alert-warning">You can't edit the bonus.</div>}

      <Field
        name="label"
        label={attributeLabels.label}
        type="text"
        disabled={disabled}
        component={InputField}
      />
      <Field
        name="priority"
        label={attributeLabels.priority}
        type="text"
        disabled={disabled}
        component={InputField}
      />
      <Field
        name="playerUUID"
        label={attributeLabels.playerUUID}
        type="text"
        disabled={disabled}
        component={InputField}
      />
      <Field
        name="grantedAmount"
        label={attributeLabels.grantedAmount}
        type="text"
        disabled={disabled}
        component={InputField}
      />
      <Field
        name="amountToWage"
        label={attributeLabels.amountToWage}
        type="text"
        disabled={disabled}
        component={InputField}
      />
      <Field
        name="expirationDate"
        label={attributeLabels.expirationDate}
        disabled={disabled}
        component={SingleDateField}
        onChange={this.props.change}
      />
      <Field
        name="prize"
        label={attributeLabels.prize}
        type="text"
        disabled={disabled}
        component={InputField}
      />
      <Field
        name="capping"
        label={attributeLabels.capping}
        type="text"
        disabled={disabled}
        component={InputField}
      />

      <div className={classNames('form-group row')}>
        <div className="col-md-9 col-md-offset-3">
          <div className="checkbox">
            <label>
              <Field
                name="optIn"
                type="checkbox"
                component="input"
                disabled={disabled}
              /> {attributeLabels.optIn}
            </label>
          </div>
        </div>
      </div>

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
