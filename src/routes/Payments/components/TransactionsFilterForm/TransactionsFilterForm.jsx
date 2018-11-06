import React, { Component } from 'react';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../constants/propTypes';
import { createValidator, translateLabels } from '../../../../utils/validator';
import {
  types,
  typesLabels,
  methodsLabels,
  statusesLabels,
} from '../../../../constants/payment';
import { InputField, DateTimeField, NasSelectField, RangeGroup } from '../../../../components/ReduxForm';
import { attributeLabels, attributePlaceholders } from './constants';
import renderLabel from '../../../../utils/renderLabel';
import countries from '../../../../utils/countryList';
import { floatNormalize } from '../../../../utils/inputNormalize';

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
      statuses: PropTypes.arrayOf(PropTypes.string),
      paymentMethod: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
    filterByType: PropTypes.bool,
    paymentMethods: PropTypes.arrayOf(PropTypes.paymentMethod).isRequired,
    statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
    invalid: PropTypes.bool,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
  static defaultProps = {
    invalid: true,
    reset: null,
    handleSubmit: null,
    submitting: false,
    pristine: false,
    disabled: false,
    currentValues: null,
    filterByType: false,
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.endDate
      ? current.isSameOrBefore(moment(currentValues.endDate))
      : current.isSameOrBefore(moment());
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
      paymentMethods,
      filterByType,
      statuses,
      invalid,
      currencies,
    } = this.props;

    return (
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="keyword"
          type="text"
          label={I18n.t(attributeLabels.keyword)}
          placeholder={I18n.t(attributePlaceholders.keyword)}
          component={InputField}
          inputAddon={<i className="icon icon-search" />}
          id="transactions-list-filters-search"
          className="filter-row__big"
        />
        <Field
          name="countryCode"
          label={I18n.t(attributeLabels.country)}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          component={NasSelectField}
          className="filter-row__medium"
        >
          {Object
            .keys(countries)
            .map(key => <option key={key} value={key}>{countries[key]}</option>)
          }
        </Field>
        <If condition={filterByType}>
          <Field
            name="type"
            label={I18n.t(attributeLabels.type)}
            component={NasSelectField}
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            className="filter-row__medium"
          >
            {Object.keys(types).filter(i => typesLabels[i]).map(type => (
              <option key={type} value={type}>
                {renderLabel(type, typesLabels)}
              </option>
            ))}
          </Field>
        </If>
        <Field
          name="paymentMethod"
          label={I18n.t(attributeLabels.paymentMethod)}
          component={NasSelectField}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          className="filter-row__medium"
        >
          {paymentMethods.map(method => (
            <option key={method.uuid} value={method.methodName}>
              {renderLabel(method.methodName, methodsLabels)}
            </option>
          ))}
        </Field>
        <Field
          name="statuses"
          label={I18n.t(attributeLabels.statuses)}
          component={NasSelectField}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          multiple
          className="filter-row__medium"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {renderLabel(status, statusesLabels)}
            </option>
          ))}
        </Field>
        <Field
          name="currency"
          label={I18n.t('COMMON.CURRENCY')}
          component={NasSelectField}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          className="filter-row__medium"
        >
          {currencies.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Field>
        <RangeGroup
          className="filter-row__medium"
          label={I18n.t(attributeLabels.amount)}
        >
          <Field
            name="amountLowerBound"
            type="number"
            normalize={floatNormalize}
            placeholder="0.00"
            component={InputField}
          />
          <Field
            name="amountUpperBound"
            type="number"
            normalize={floatNormalize}
            placeholder="0.00"
            component={InputField}
          />
        </RangeGroup>
        <RangeGroup
          className="filter-row__medium"
          label={I18n.t(attributeLabels.creationDateRange)}
        >
          <Field
            utc
            name="startDate"
            placeholder={I18n.t(attributeLabels.startDate)}
            component={DateTimeField}
            isValidDate={this.startDateValidator}
            pickerClassName="left-side"
          />
          <Field
            utc
            name="endDate"
            placeholder={I18n.t(attributeLabels.endDate)}
            component={DateTimeField}
            isValidDate={this.endDateValidator}
          />
        </RangeGroup>
        <div className="filter-row__button-block">
          <button
            disabled={submitting || (disabled && pristine)}
            className="btn btn-default"
            onClick={this.handleReset}
            type="reset"
          >
            {I18n.t('COMMON.RESET')}
          </button>
          <button
            disabled={submitting || (disabled && pristine) || invalid}
            className="btn btn-primary"
            type="submit"
            id="transactions-list-filters-apply-button"
          >
            {I18n.t('COMMON.APPLY')}
          </button>
        </div>
      </form>
    );
  }
}

const FORM_NAME = 'transactionsFilter';
const FilterForm = reduxForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: createValidator({
    keyword: 'string',
    initiatorType: ['string'],
    type: ['string', `in:${Object.keys(types).join()}`],
    statuses: ['array'],
    paymentMethod: 'string',
    startDate: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    endDate: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    amountLowerBound: 'numeric',
    amountUpperBound: 'numeric',
  }, translateLabels(attributeLabels), false),
})(TransactionsFilterForm);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
