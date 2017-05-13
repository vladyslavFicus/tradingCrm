import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues } from 'redux-form';
import classNames from 'classnames';
import moment from 'moment';
import RemoteDateRangePickerWrapper from '../../../components/Forms/RemoteDateRangePickerWrapper';
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

  constructor(props) {
    super(props);

    this.state = {
      startDate: props.initialValues && props.initialValues.startDate !== undefined ?
        moment(props.initialValues.startDate) : null,
      endDate: props.initialValues && props.initialValues.endDate !== undefined ?
        moment(props.initialValues.endDate) : null,
    };
  }

  componentDidMount() {
    if (typeof this.props.onMount === 'function') {
      this.props.onMount();
    }
  }

  handleDatesChange = ({ startDate, endDate }) => {
    const { change, fields } = this.props;

    this.setState({ startDate, endDate }, () => {
      if (startDate) {
        const formattedDate = `${startDate.format('YYYY-MM-DD')}T00:00:00`;
        if (fields.startDate !== formattedDate) {
          change('startDate', formattedDate);
        }
      }

      if (endDate) {
        const formattedDate = `${endDate.format('YYYY-MM-DD')}T23:59:59`;
        if (fields.endDate !== formattedDate) {
          change('endDate', formattedDate);
        }
      }
    });
  };

  handleResetForm = () => {
    this.handleDatesChange({ startDate: null, endDate: null });

    this.props.reset();
  };

  render() {
    const { startDate, endDate } = this.state;
    const { handleSubmit, pristine, submitting, onSubmit, errors, disabled, currencies } = this.props;

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

        <div className={classNames('form-group row', { 'has-danger': errors.startDate || errors.endDate })}>
          <div className="col-md-3">
            <label className="form-control-label">Period</label>
          </div>
          <div className="col-md-9">
            <RemoteDateRangePickerWrapper
              isOutsideRange={day => day <= moment()}
              onDatesChange={this.handleDatesChange}
              startDate={startDate}
              endDate={endDate}
              disabled={disabled}
            />

            <Field type="hidden" component="input" name="startDate" />
            <Field type="hidden" component="input" name="endDate" />

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
  fields: getFormValues(FORM_NAME)(state),
  errors: errorSelector(state),
}), {})(ManageReduxForm);
