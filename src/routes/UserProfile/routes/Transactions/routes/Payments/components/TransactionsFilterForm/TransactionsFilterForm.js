import React, { Component } from 'react';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../../../../../constants/propTypes';
import { createValidator } from '../../../../../../../../utils/validator';
import {
  types,
  typesLabels,
  statusesLabels,
  methodsLabels,
  initiatorsLabels,
} from '../../../../../../../../constants/payment';
import { InputField, DateTimeField, NasSelectField } from '../../../../../../../../components/ReduxForm/index';
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
  };
  static defaultProps = {
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
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__big">
              <Field
                name="keyword"
                type="text"
                label={I18n.t(attributeLabels.keyword)}
                placeholder={I18n.t(attributePlaceholders.keyword)}
                component={InputField}
                position="vertical"
                iconLeftClassName="nas nas-search_icon"
                id="transactions-list-filters-search"
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="initiatorType"
                label={I18n.t(attributeLabels.initiatorType)}
                position="vertical"
                component={NasSelectField}
              >
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
                label={I18n.t(attributeLabels.type)}
                position="vertical"
                component={NasSelectField}
              >
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
                label={I18n.t(attributeLabels.statuses)}
                position="vertical"
                component={NasSelectField}
                multiple
              >
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
                label={I18n.t(attributeLabels.paymentMethod)}
                position="vertical"
                component={NasSelectField}
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>
                    {renderLabel(method, methodsLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <div className="form-group">
                <label>{I18n.t(attributeLabels.amount)}</label>
                <div className="range-group">
                  <Field
                    name="amountLowerBound"
                    type="text"
                    placeholder="0.00"
                    component={InputField}
                    position="vertical"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="amountUpperBound"
                    type="text"
                    placeholder="0.00"
                    component={InputField}
                    position="vertical"
                  />
                </div>
              </div>
            </div>
            <div className="filter-row__medium">
              <div className="form-group">
                <label>{I18n.t(attributeLabels.creationDateRange)}</label>
                <div className="range-group">
                  <Field
                    utc
                    name="startDate"
                    placeholder={I18n.t(attributeLabels.startDate)}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator}
                    position="vertical"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    utc
                    name="endDate"
                    placeholder={I18n.t(attributeLabels.endDate)}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator}
                    position="vertical"
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
                  {I18n.t('COMMON.RESET')}
                </button>
                <button
                  disabled={submitting || (disabled && pristine)}
                  className="btn btn-primary"
                  type="submit"
                  id="transactions-list-filters-apply-button"
                >
                  {I18n.t('COMMON.APPLY')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const validatorAttributeLabels = Object.keys(attributeLabels).reduce((res, name) => ({
  ...res,
  [name]: I18n.t(attributeLabels[name]),
}), {});
const FORM_NAME = 'playerTransactionsFilter';
const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: createValidator({
    keyword: 'string',
    initiatorType: ['string'],
    type: ['string', `in:${Object.keys(types).join()}`],
    statuses: ['array'],
    paymentMethod: 'string',
    startDate: 'string',
    endDate: 'string',
    amountLowerBound: 'numeric',
    amountUpperBound: 'numeric',
  }, validatorAttributeLabels, false),
})(TransactionsFilterForm);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
