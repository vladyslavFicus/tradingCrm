import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import { InputField, SingleDateField, SelectField } from 'components/ReduxForm';
import { formErrorSelector } from 'utils/redux-form';
import { createValidator } from 'utils/validator';

const formName = 'bonusManage';
const errorSelector = formErrorSelector(formName);

const attributeLabels = {
  playerUUID: 'Player UUID',
  label: 'Name',
  priority: 'Priority',
  currency: 'Currency',
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
  optIn: 'boolean',
  converted: 'required',
  wagered: 'required',
  currency: 'required',
}, attributeLabels, false);

class ManageForm extends Component {
  handleResetForm = () => {
    this.props.reset();
  };

  componentDidMount() {
    if (typeof this.props.onMount === 'function') {
      this.props.onMount();
    }
  }

  render() {
    const { handleSubmit, pristine, submitting, onSubmit, disabled, currencies } = this.props;

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
        name="currency"
        label={attributeLabels.currency}
        type="select"
        disabled={disabled}
        component={SelectField}
      >
        <option value="">--- Chose currency ---</option>
        {currencies.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Field>
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

ManageForm.defaultProps = {
  currencies: [],
};
ManageForm.propTypes = {
  onMount: PropTypes.func,
  currencies: PropTypes.array,
};

let ManageReduxForm = reduxForm({
  form: formName,
  validate: validator,
})(ManageForm);
ManageReduxForm = connect((state) => ({
  errors: errorSelector(state),
}), {})(ManageReduxForm);

export default ManageReduxForm;
