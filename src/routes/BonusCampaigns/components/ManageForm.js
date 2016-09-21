import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import classNames from 'classnames';
import RemoteDateRangePickerWrapper from 'components/Forms/RemoteDateRangePickerWrapper';
import { CustomValueField, SelectField } from 'components/ReduxForm';
import { renderField, renderError, formErrorSelector } from 'utils/redux-form';
import { stopEvent } from 'utils/helpers';
import { createValidator } from 'utils/validator';
import { priorityMoneyTypeUsage, eventsTypes, customValueFieldTypesLabels } from 'constants/form';
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
  'campaignRatio.value': 'Ratio value',
  'campaignRatio.type': 'Ratio value type',
  bonusAmount: 'Bonus amount',
  capping: 'Capping',
  'capping.value': 'Capping value',
  'capping.type': 'Capping value type',
  conversionPrize: 'Conversion prize',
  'conversionPrize.value': 'Conversion prize value',
  'conversionPrize.type': 'Conversion prize value type',
  wagerWinMultiplier: 'Multiplier',
  eventsTypes: 'Events types',
  priorityMoneyTypeUsage: 'Money usage',
};

const validator = createValidator({
  campaignName: 'required',
  startDate: 'required',
  endDate: 'required|nextDate:startDate',
  bonusLifetime: 'required|integer',
  'campaignRatio.value': 'required|numeric|customTypeValue.value',
  'campaignRatio.type': ['required', 'in:' + Object.keys(customValueFieldTypesLabels).join()],
  capping: {
    value: 'required|numeric|customTypeValue.value',
    type: ['required', 'in:' + Object.keys(customValueFieldTypesLabels).join()],
  },
  conversionPrize: {
    value: 'required|numeric|customTypeValue.value',
    type: ['required', 'in:' + Object.keys(customValueFieldTypesLabels).join()],
  },
  bonusAmount: 'required|numeric',
  wagerWinMultiplier: 'required|integer|max:999',
  eventsTypes: ['required', 'array', 'in:' + Object.keys(eventsTypes).join()],
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
      <CustomValueField
        basename={'campaignRatio'}
        label={attributeLabels.campaignRatio}
        typeValues={customValueFieldTypesLabels}
        disabled={disabled}
        errors={errors}
      />
      <Field
        name="bonusAmount"
        label={attributeLabels.bonusAmount}
        type="text"
        disabled={disabled}
        component={renderField}
      />
      <CustomValueField
        basename={'capping'}
        label={attributeLabels.capping}
        typeValues={customValueFieldTypesLabels}
        disabled={disabled}
        errors={errors}
      />
      <CustomValueField
        basename={'conversionPrize'}
        label={attributeLabels.conversionPrize}
        typeValues={customValueFieldTypesLabels}
        disabled={disabled}
        errors={errors}
      />
      <Field
        name="wagerWinMultiplier"
        label={attributeLabels.wagerWinMultiplier}
        type="text"
        disabled={disabled}
        component={renderField}
      />
      <Field
        name="eventsType"
        label={attributeLabels.eventsTypes}
        type="select-multiple"
        multiple={true}
        disabled={disabled}
        component={SelectField}
      >
        {Object.keys(eventsTypes).map((key) => (
          <option key={key} value={key}>{eventsTypes[key]}</option>
        ))}
      </Field>
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

      <div className={classNames('form-group row')}>
        <div className="col-md-9 col-md-offset-3">
          <div className="checkbox">
            <label>
              <Field
                name="optIn"
                type="checkbox"
                component="input"
                disabled={disabled}
              /> Opt-In
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
  fields: valueSelector(state, 'startDate', 'endDate'),
  errors: errorSelector(state),
}), {})(ManageReduxForm);

export default ManageReduxForm;
