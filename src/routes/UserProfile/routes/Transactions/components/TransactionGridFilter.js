import React, { Component, PropTypes } from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import classNames from 'classnames';
import { initiators, initiatorsLabels } from 'constants/transaction';
import { createValidator } from 'utils/validator';
import { types, statuses, methods, typesLabels, statusesLabels, methodsLabels } from 'constants/payment';
import moment from 'moment';
import DateTime from 'react-datetime';
import Currency from 'components/Amount/Currency';

const FORM_NAME = 'userTransactionsFilter';
const transactionGridValuesSelector = formValueSelector(FORM_NAME);

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
  initiatorType: ['string', 'in:' + Object.keys(initiators).join()],
  type: ['string', 'in:' + Object.keys(types).join()],
  statuses: ['string', 'in:' + Object.keys(statuses).join()],
  paymentMethod: ['string', 'in:' + Object.keys(methods).join()],
  startDate: 'string',
  endDate: 'string',
  amountLowerBound: 'numeric',
  amountUpperBound: 'numeric',
}, attributeLabels, false);

class TransactionGridFilter extends Component {
  handleDateTimeChange = (callback) => (value) => {
    callback(value ? value.format('YYYY-MM-DD') : '');
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues.endDate
      ? current.isSameOrBefore(moment(currentValues.endDate))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues.startDate
      ? current.isSameOrAfter(moment(currentValues.startDate))
      : true;
  };

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
      reset,
      currencyCode,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col-md-3">
            <span className="font-size-20">Transactions</span>
          </div>
        </div>

        <div className="well">
          <div className="row">
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-4">
                  <Field
                    name="keyword"
                    type="text"
                    label={'Search by'}
                    placeholder={attributeLabels.keyword}
                    component={this.renderQueryField}
                  />
                </div>
                <div className="col-md-2">
                  <Field
                    name="initiatorType"
                    label={attributeLabels.initiatorType}
                    emptyOptionLabel="Anyone"
                    component={this.renderSelectField}
                  >
                    {Object.keys(initiatorsLabels).map(assign => (
                      <option key={assign} value={assign}>
                        {initiatorsLabels[assign]}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field
                    name="type"
                    label={attributeLabels.type}
                    emptyOptionLabel="Any type"
                    component={this.renderSelectField}
                  >
                    {Object.keys(typesLabels).map(type => (
                      <option key={type} value={type}>
                        {typesLabels[type]}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field
                    name="statuses"
                    label={attributeLabels.statuses}
                    emptyOptionLabel="Any status"
                    component={this.renderSelectField}
                  >
                    {Object.keys(statusesLabels).map(status => (
                      <option key={status} value={status}>
                        {statusesLabels[status]}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field
                    name="paymentMethod"
                    label={attributeLabels.paymentMethod}
                    emptyOptionLabel="Any method"
                    component={this.renderSelectField}
                  >
                    {Object.keys(methodsLabels).map(method => (
                      <option key={method} value={method}>
                        {methodsLabels[method]}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-5">
                        <Field
                          name="amountLowerBound"
                          type="text"
                          label={attributeLabels.amountLowerBound}
                          placeholder='0.00'
                          currencyCode={currencyCode}
                          component={this.renderAmountField}
                        />
                      </div>
                      <div className="col-md-5">
                        <Field
                          name="amountUpperBound"
                          type="text"
                          label={attributeLabels.amountUpperBound}
                          placeholder='0.00'
                          currencyCode={currencyCode}
                          component={this.renderAmountField}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Creation date range</label>

                    <div className="row">
                      <div className="col-md-5">
                        <Field
                          name="startDate"
                          placeholder={attributeLabels.startDate}
                          component={this.renderDateField}
                          isValidDate={this.startDateValidator}
                        />
                      </div>
                      <div className="col-md-5">
                        <Field
                          name="endDate"
                          placeholder={attributeLabels.endDate}
                          component={this.renderDateField}
                          isValidDate={this.endDateValidator}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-2">
              <div className="form-group">
                <br/>
                <button disabled={submitting} className="btn btn-default" onClick={reset}>
                  Reset
                </button>
                {' '}
                <button disabled={submitting} className="btn btn-primary" type="submit">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  renderQueryField = ({ input, label, placeholder, type, disabled, meta: { touched, error }, inputClassName }) => {
    return <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <label>{label}</label>
      <div className="form-input-icon">
        <i className="icmn-search"/>
        <input
          {...input}
          disabled={disabled}
          type={type}
          className={classNames('form-control', inputClassName, { 'has-danger': touched && error })}
          placeholder={placeholder}
          title={placeholder}
        />
      </div>
    </div>;
  };

  renderAmountField = ({ input, label, placeholder, type, disabled, meta: { touched, error }, inputClassName, currencyCode }) => {
    return <div><label>{label}</label>
      <div className={classNames('input-group', { 'has-danger': touched && error })}>
        <div className="input-group-addon">
          { currencyCode && <Currency code={currencyCode}/> }
        </div>
        <input
          {...input}
          disabled={disabled}
          type={type}
          className={classNames('form-control', inputClassName, { 'has-danger': touched && error })}
          placeholder={placeholder}
          title={placeholder}
        />
      </div>
    </div>;
  };

  renderSelectField = ({ input, children, label, meta: { touched, error }, emptyOptionLabel }) => {
    return <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <label>{label}</label>
      <select
        {...input}
        className={classNames('form-control form-control-sm', { 'has-danger': touched && error })}
      >
        <option>{emptyOptionLabel}</option>
        {children}
      </select>
    </div>;
  };

  renderDateField = ({ input, placeholder, disabled, meta: { touched, error }, isValidDate }) => {
    return <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <div className="input-group">
        <DateTime
          dateFormat="MM/DD/YYYY"
          timeFormat={false}
          onChange={this.handleDateTimeChange(input.onChange)}
          value={input.value ? moment(input.value) : null}
          closeOnSelect={true}
          inputProps={{
            disabled,
            placeholder,
          }}
          isValidDate={isValidDate}
        />
        <span className="input-group-addon">
          <i className="fa fa-calendar"/>
        </span>
      </div>
    </div>;
  };

}

const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(TransactionGridFilter);

export default connect((state) => {
  return {
    currentValues: {
      keyword: transactionGridValuesSelector(state, 'keyword'),
      initiatorType: transactionGridValuesSelector(state, 'initiatorType'),
      type: transactionGridValuesSelector(state, 'type'),
      statuses: transactionGridValuesSelector(state, 'statuses'),
      paymentMethod: transactionGridValuesSelector(state, 'paymentMethod'),
      startDate: transactionGridValuesSelector(state, 'startDate'),
      endDate: transactionGridValuesSelector(state, 'endDate'),
      amountLowerBound: transactionGridValuesSelector(state, 'amountLowerBound'),
      amountUpperBound: transactionGridValuesSelector(state, 'amountUpperBound'),
    },
  };
})(FilterForm);
