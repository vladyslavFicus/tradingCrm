import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { initiators, initiatorsLabels } from '../../../../../constants/transaction';
import { createValidator } from '../../../../../utils/validator';
import { types, statuses, methods, typesLabels, statusesLabels, methodsLabels } from '../../../../../constants/payment';
import { InputField, SelectField, DateTimeField } from '../../../../../components/ReduxForm';

const FORM_NAME = 'transactionsFilter';
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

class TransactionsFilterForm extends Component {
  static propTypes = {
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
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
    this.props.onReset();
  };

  render() {
    const {
      submitting,
      pristine,
      disabled,
      handleSubmit,
      onSubmit,
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                id="transactions-list-filters-search"
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="initiatorType"
                label={attributeLabels.initiatorType}
                labelClassName="form-label"
                position="vertical"
                component={SelectField}
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
                labelClassName="form-label"
                position="vertical"
                component={SelectField}
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
                labelClassName="form-label"
                position="vertical"
                component={SelectField}
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
                labelClassName="form-label"
                position="vertical"
                component={SelectField}
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
                  position="vertical"
                  placeholder="0.00"
                  component={InputField}
                />
                <span className="range-group__separator">-</span>
                <Field
                  name="amountUpperBound"
                  type="text"
                  label={attributeLabels.amountUpperBound}
                  position="vertical"
                  placeholder="0.00"
                  component={InputField}
                />
              </div>
            </div>
            <div className="filter-row__medium">
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
                  disabled={submitting || (disabled && pristine)}
                  className="btn btn-default"
                  onClick={this.handleReset}
                  type="reset"
                >
                  Reset
                </button>
                <button
                  disabled={submitting || (disabled && pristine)}
                  className="btn btn-primary"
                  type="submit"
                  id="transactions-list-filters-apply-button"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(TransactionsFilterForm);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
