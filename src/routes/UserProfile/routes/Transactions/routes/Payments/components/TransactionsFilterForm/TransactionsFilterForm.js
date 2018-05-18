import React, { Component } from 'react';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../../../../../constants/propTypes';
import { createValidator, translateLabels } from '../../../../../../../../utils/validator';
import {
  types,
  typesLabels,
  statusesLabels,
  methodsLabels,
  initiatorsLabels,
} from '../../../../../../../../constants/payment';
import { InputField, DateTimeField, NasSelectField, RangeGroup } from '../../../../../../../../components/ReduxForm';
import { attributeLabels, attributePlaceholders } from './constants';
import renderLabel from '../../../../../../../../utils/renderLabel';

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
    paymentMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
    statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
    invalid: PropTypes.bool,
  };
  static defaultProps = {
    invalid: true,
    reset: null,
    handleSubmit: null,
    submitting: false,
    pristine: false,
    disabled: false,
    currentValues: null,
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.endDate
      ? current.isSameOrBefore(moment(currentValues.endDate))
      : current.isSameOrBefore(moment());
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return current.isSameOrBefore(moment()) && (
      currentValues && currentValues.startDate
        ? current.isSameOrAfter(moment(currentValues.startDate))
        : true
    );
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
      statuses,
      invalid,
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
          name="initiatorType"
          label={I18n.t(attributeLabels.initiatorType)}
          component={NasSelectField}
          className="filter-row__medium"
        >
          {Object.keys(initiatorsLabels).map(assign => (
            <option key={assign} value={assign}>
              {initiatorsLabels[assign]}
            </option>
          ))}
        </Field>
        <Field
          name="type"
          label={I18n.t(attributeLabels.type)}
          component={NasSelectField}
          className="filter-row__medium"
        >
          {Object.keys(types).map(type => (
            <option key={type} value={type}>
              {renderLabel(type, typesLabels)}
            </option>
          ))}
        </Field>
        <Field
          name="statuses"
          label={I18n.t(attributeLabels.statuses)}
          component={NasSelectField}
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
          name="paymentMethod"
          label={I18n.t(attributeLabels.paymentMethod)}
          component={NasSelectField}
          className="filter-row__medium"
        >
          {paymentMethods.map(method => (
            <option key={method} value={method}>
              {renderLabel(method, methodsLabels)}
            </option>
          ))}
        </Field>
        <RangeGroup
          className="filter-row__medium"
          label={I18n.t(attributeLabels.amount)}
        >
          <Field
            name="amountLowerBound"
            type="text"
            placeholder="0.00"
            component={InputField}
          />
          <Field
            name="amountUpperBound"
            type="text"
            placeholder="0.00"
            component={InputField}
          />
        </RangeGroup>
        <RangeGroup
          className="filter-row__dates"
          label={I18n.t(attributeLabels.creationDateRange)}
        >
          <Field
            utc
            name="startDate"
            placeholder={I18n.t(attributeLabels.startDate)}
            component={DateTimeField}
            isValidDate={this.startDateValidator}
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

const FORM_NAME = 'playerTransactionsFilter';
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
