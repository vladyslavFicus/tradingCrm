import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import classNames from 'classnames';
import RemoteDateRangePickerWrapper from 'components/Forms/RemoteDateRangePickerWrapper';
import { renderField, renderError, formErrorSelector } from 'utils/redux-form';
import { stopEvent } from 'utils/helpers';
import { createValidator } from 'utils/validator';
import moment from 'moment';

const formName = 'campaignCreation';
const valueSelector = formValueSelector(formName);
const errorSelector = formErrorSelector(formName);

const attributeLabels = {
  campaignName: 'Name',
  startDate: 'Start date',
  endDate: 'End date',
  bonusLifetime: 'Bonus life time',
  campaignRatio: 'Ratio',
  bonusAmount: 'Bonus amount',
  wagerWinMultiplier: 'Multiplier',
  triggerType: 'Trigger type',
  priorityMoneyTypeUsage: 'Money usage',
};

const triggerTypes = {
  FIRST_DEPOSIT: 'First deposit',
};
const priorityMoneyTypeUsage = {
  REAL: 'Real money',
  BONUS: 'Bonus money',
};
const validator = createValidator({
  campaignName: 'required',
  startDate: 'required',
  endDate: 'required|nextDate:startDate',
  bonusLifetime: 'required|integer',
  campaignRatio: 'required|numeric',
  bonusAmount: 'required|numeric',
  wagerWinMultiplier: 'required|integer|max:999',
  triggerType: ['required', 'in:' + Object.keys(triggerTypes).join()],
  priorityMoneyTypeUsage: ['required', 'in:' + Object.keys(priorityMoneyTypeUsage).join()],
}, attributeLabels, false);

class ManageForm extends Component {
  constructor(props) {
    super(props);

    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handleResetForm = this.handleResetForm.bind(this);

    this.state = {
      startDate: props.initialValues && props.initialValues.startDate !== undefined ?
        moment(props.initialValues.startDate) : null,
      endDate: props.initialValues && props.initialValues.endDate !== undefined ?
        moment(props.initialValues.endDate) : null,
    };
  }

  handleDatesChange({ startDate, endDate }) {
    const { dispatch, change, fields } = this.props;

    this.setState({ startDate, endDate }, () => {
      if (startDate) {
        const formattedDate = startDate.format('YYYY-MM-DD') + 'T00:00:00';
        if (fields.startDate !== formattedDate) {
          dispatch(change('startDate', formattedDate));
        }
      }

      if (endDate) {
        const formattedDate = endDate.format('YYYY-MM-DD') + 'T23:59:59';
        if (fields.endDate !== formattedDate) {
          dispatch(change('endDate', formattedDate));
        }
      }
    });
  }

  handleResetForm() {
    this.handleDatesChange({ startDate: null, endDate: null });

    this.props.reset();
  }

  render() {
    const { startDate, endDate } = this.state;
    const { handleSubmit, pristine, submitting, onSubmit, errors, disabled } = this.props;

    return <form onSubmit={handleSubmit(onSubmit)}>
      {disabled && <div className="alert alert-warning">You can't edit the campaign.</div>}
      <Field
        name="campaignName"
        label={attributeLabels.campaignName}
        type="text"
        disabled={disabled}
        component={renderField}
      />
      <Field
        name="bonusLifetime"
        label={attributeLabels.bonusLifetime}
        type="text"
        disabled={disabled}
        component={renderField}
      />
      <Field
        name="campaignRatio"
        label={attributeLabels.campaignRatio}
        type="text"
        disabled={disabled}
        component={renderField}
      />
      <Field
        name="bonusAmount"
        label={attributeLabels.bonusAmount}
        type="text"
        disabled={disabled}
        component={renderField}
      />
      <Field
        name="wagerWinMultiplier"
        label={attributeLabels.wagerWinMultiplier}
        type="text"
        disabled={disabled}
        component={renderField}
      />
      <Field
        name="triggerType"
        label={attributeLabels.triggerType}
        type="select"
        values={{ '': '-- Choose --', ...triggerTypes }}
        disabled={disabled}
        component={renderField}
      />
      <Field
        name="priorityMoneyTypeUsage"
        label={attributeLabels.priorityMoneyTypeUsage}
        type="select"
        values={{ '': '-- Choose --', ...priorityMoneyTypeUsage }}
        disabled={disabled}
        component={renderField}
      />

      <div className={classNames('form-group row', { 'has-danger': errors.startDate || errors.endDate })}>
        <div className="col-md-3">
          <label className="form-control-label">Period</label>
        </div>
        <div className="col-md-9">
          <RemoteDateRangePickerWrapper
            isOutsideRange={(day) => day <= moment()}
            onDatesChange={this.handleDatesChange}
            startDate={startDate}
            endDate={endDate}
            disabled={disabled}
          />

          <Field type="hidden" component="input" name="startDate"/>
          <Field type="hidden" component="input" name="endDate"/>

          {errors.startDate && <div className="form-control-feedback">
            {errors.startDate}
          </div>}
          {errors.endDate && <div className="form-control-feedback">
            {errors.endDate}
          </div>}
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
  fields: valueSelector(state, 'startDate', 'endDate'),
  errors: errorSelector(state),
}), {})(ManageReduxForm);

export default ManageReduxForm;
