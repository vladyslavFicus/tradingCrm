import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { InputField, SelectField, DateTimeField } from '../../../../../components/ReduxForm';
import { initiators, initiatorsLabels } from '../../../../../constants/transaction';
import { createValidator } from '../../../../../utils/validator';
import { types, statuses, methods, typesLabels, statusesLabels, methodsLabels } from '../../../../../constants/payment';
import Currency from '../../../../../components/Amount/Currency';

const FORM_NAME = 'userTransactionsFilter';
const attributeLabels = {
  keyword: 'Payment ID, External reference...',
  initiatorType: 'Initiated by',
  type: 'Transaction type',
  statuses: 'Transaction status',
  paymentMethod: 'Payment method',
  startDate: 'Start date',
  endDate: 'End date',
  amountLowerBound: 'From',
  amountUpperBound: 'To',
};
const validator = createValidator({
  keyword: 'string',
  initiatorType: ['string', `in:${Object.keys(initiators).join()}`],
  type: ['string', `in:${Object.keys(types).join()}`],
  statuses: ['string', `in:${Object.keys(statuses).join()}`],
  paymentMethod: ['string', `in:${Object.keys(methods).join()}`],
  startDate: 'string',
  endDate: 'string',
  amountLowerBound: 'numeric',
  amountUpperBound: 'numeric',
}, attributeLabels, false);

class TransactionGridFilter extends Component {
  static propTypes = {
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    currencyCode: PropTypes.string,
    currentValues: PropTypes.shape({
      keyword: PropTypes.string,
      initiatorType: PropTypes.string,
      type: PropTypes.string,
      statuses: PropTypes.string,
      paymentMethod: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.endDate
      ? current.isSameOrBefore(moment(currentValues.endDate))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.startDate
      ? current.isSameOrAfter(moment(currentValues.startDate))
      : true;
  };

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();
  };

  renderAmountField = (props) => {
    const { input, label, placeholder, type, disabled, meta: { touched, error }, inputClassName, currencyCode } = props;

    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <label>{label}</label>
        <div className="input-with-icon input-with-icon__left">
          <span className="input-left-icon">
            {currencyCode && <Currency code={currencyCode} />}
          </span>
          <input
            {...input}
            disabled={disabled}
            type={type}
            className={classNames('form-control', inputClassName, { 'has-danger': touched && error })}
            placeholder={placeholder}
            title={placeholder}
          />
        </div>
      </div>
    );
  };

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
      currencyCode,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="well">
          <div className="filter-row">
            <div className="filter-row__big">
              <Field
                name="keyword"
                type="text"
                label={'Search by'}
                placeholder={attributeLabels.keyword}
                component={InputField}
                position="vertical"
                iconLeftClassName="nas nas-search_icon"
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="initiatorType"
                label={attributeLabels.initiatorType}
                component={SelectField}
                position="vertical"
              >
                <option value="">Anyone</option>
                {Object.keys(initiatorsLabels).map(assign => (
                  <option key={assign} value={assign}>
                    {initiatorsLabels[assign]}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="type"
                label={attributeLabels.type}
                component={SelectField}
                position="vertical"
              >
                <option value="">Any type</option>
                {Object.keys(typesLabels).map(type => (
                  <option key={type} value={type}>
                    {typesLabels[type]}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="statuses"
                label={attributeLabels.statuses}
                component={SelectField}
                position="vertical"
              >
                <option value="">Any status</option>
                {Object.keys(statusesLabels).map(status => (
                  <option key={status} value={status}>
                    {statusesLabels[status]}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="paymentMethod"
                label={attributeLabels.paymentMethod}
                component={SelectField}
                position="vertical"
              >
                <option value="">Any method</option>
                {Object.keys(methodsLabels).map(method => (
                  <option key={method} value={method}>
                    {methodsLabels[method]}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <div className="range-group">
                <Field
                  name="amountLowerBound"
                  type="text"
                  label={attributeLabels.amountLowerBound}
                  placeholder="0.00"
                  currencyCode={currencyCode}
                  component={this.renderAmountField}
                />
                <span className="range-group__separator">-</span>
                <Field
                  name="amountUpperBound"
                  type="text"
                  label={attributeLabels.amountUpperBound}
                  placeholder="0.00"
                  currencyCode={currencyCode}
                  component={this.renderAmountField}
                />
              </div>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>Creation date range</label>
                <div className="range-group">
                  <Field
                    name="startDate"
                    placeholder={attributeLabels.startDate}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator}
                    position="vertical"
                    className={null}
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="endDate"
                    placeholder={attributeLabels.endDate}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator}
                    position="vertical"
                    className={null}
                  />
                </div>
              </div>
            </div>
            <div className="filter-row__button-block">
              <div className="button-block-container">
                <button
                  disabled={submitting}
                  className="btn btn-default btn-sm"
                  onClick={this.handleReset}
                  type="reset"
                >
                  Reset
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary btn-sm"
                  type="submit"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(TransactionGridFilter);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
