import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues } from 'redux-form';
import classNames from 'classnames';
import moment from 'moment';
import DateTime from 'react-datetime';
import { CustomValueField, SelectField, InputField } from '../../../components/ReduxForm';
import { formErrorSelector } from '../../../utils/redux-form';
import { createValidator } from '../../../utils/validator';
import { customValueFieldTypesLabels } from '../../../constants/form';
import { eventTypesLabels } from '../constants';

const FORM_NAME = 'campaignCreation';
const errorSelector = formErrorSelector(FORM_NAME);
const attributeLabels = {
  campaignName: 'Name',
  startDate: 'Start date',
  endDate: 'End date',
  currency: 'Currency',
  bonusLifetime: 'Bonus life time',
  campaignRatio: 'Ratio',
  'campaignRatio.value': 'Ratio value',
  'campaignRatio.type': 'Ratio value type',
  capping: 'Capping',
  'capping.value': 'Capping value',
  'capping.type': 'Capping value type',
  conversionPrize: 'Conversion prize',
  'conversionPrize.value': 'Conversion prize value',
  'conversionPrize.type': 'Conversion prize value type',
  wagerWinMultiplier: 'Multiplier',
  eventsTypes: 'Events types',
  optIn: 'Opt-In',
};
const validator = createValidator({
  campaignName: 'required',
  startDate: 'required',
  endDate: 'required|nextDate:startDate',
  currency: 'required',
  bonusLifetime: 'required|integer',
  'campaignRatio.value': 'required|numeric|customTypeValue.value',
  'campaignRatio.type': ['required', `in:${Object.keys(customValueFieldTypesLabels).join()}`],
  capping: {
    value: 'required|numeric|customTypeValue.value',
    type: ['required', `in:${Object.keys(customValueFieldTypesLabels).join()}`],
  },
  conversionPrize: {
    value: 'required|numeric|customTypeValue.value',
    type: ['required', `in:${Object.keys(customValueFieldTypesLabels).join()}`],
  },
  wagerWinMultiplier: 'required|integer|max:999',
  eventsTypes: ['required', 'array', `in:${Object.keys(eventTypesLabels).join()}`],
}, attributeLabels, false);

class ManageForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    fields: PropTypes.object.isRequired,
    change: PropTypes.func,
    onMount: PropTypes.func,
    currencies: PropTypes.array,
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    errors: PropTypes.object,
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    currencies: [],
  };

  componentDidMount() {
    if (typeof this.props.onMount === 'function') {
      this.props.onMount();
    }
  }

  handleResetForm = () => {
    this.handleDatesChange({ startDate: null, endDate: null });

    this.props.reset();
  };

  handleDateTimeChange = callback => (value) => {
    callback(value ? value.format('YYYY-MM-DDTHH:mm:00') : '');
  };

  startDateValidator = toAttribute => (current) => {
    const { fields: currentValues } = this.props;

    return current.isSameOrAfter(moment().subtract(1, 'd')) && (
        currentValues[toAttribute]
          ? current.isSameOrBefore(moment(currentValues[toAttribute]))
          : true
      );
  };

  endDateValidator = fromAttribute => (current) => {
    const { fields: currentValues } = this.props;

    return current.isSameOrAfter(moment().subtract(1, 'd')) && (
        currentValues[fromAttribute]
          ? current.isSameOrAfter(moment(currentValues[fromAttribute]))
          : true
      );
  };

  renderDateField = ({ input, label, placeholder, disabled, meta: { touched, error }, isValidDate }) => (
    <div className={classNames('form-group row', { 'has-danger': touched && error })}>
      <div className="col-md-3">
        <label className="form-control-label">
          {label}
        </label>
      </div>
      <div className="col-md-9">
        <div className="input-group">
          <DateTime
            dateFormat="MM/DD/YYYY"
            timeFormat="HH:mm"
            onChange={this.handleDateTimeChange(input.onChange)}
            value={input.value ? moment(input.value) : null}
            closeOnSelect
            inputProps={{
              disabled,
              placeholder,
            }}
            isValidDate={isValidDate}
          />
          <span className="input-group-addon">
          <i className="fa fa-calendar" />
        </span>
        </div>
      </div>
    </div>
  );

  render() {
    const { handleSubmit, pristine, submitting, onSubmit, errors, disabled, currencies, invalid } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {disabled && <div className="alert alert-warning">You can't edit the campaign.</div>}

        <Field
          name="campaignName"
          label={attributeLabels.campaignName}
          type="text"
          disabled={disabled}
          component={InputField}
        />
        <Field
          name="bonusLifetime"
          label={attributeLabels.bonusLifetime}
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
          {currencies.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Field>

        <CustomValueField
          basename={'campaignRatio'}
          label={attributeLabels.campaignRatio}
          typeValues={customValueFieldTypesLabels}
          disabled={disabled}
          errors={errors}
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
          component={InputField}
        />
        <Field
          name="eventsType"
          label={attributeLabels.eventsTypes}
          type="select-multiple"
          multiple
          disabled={disabled}
          component={SelectField}
        >
          {Object.keys(eventTypesLabels).map(key => (
            <option key={key} value={key}>{eventTypesLabels[key]}</option>
          ))}
        </Field>

        <Field
          name="startDate"
          label="Start date"
          component={this.renderDateField}
          isValidDate={this.startDateValidator('endDate')}
        />

        <Field
          name="endDate"
          label="End date"
          component={this.renderDateField}
          isValidDate={this.endDateValidator('startDate')}
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
                disabled={submitting || invalid}
                className="btn width-150 btn-primary"
              >
                Submit
              </button>
              {' '}
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
      </form>
    );
  }
}

const ManageReduxForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(ManageForm);
export default connect(state => ({
  fields: getFormValues(FORM_NAME)(state) || {},
  errors: errorSelector(state),
}), {})(ManageReduxForm);
