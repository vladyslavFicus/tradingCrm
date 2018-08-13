import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import {
  InputField,
  SelectField,
  DateRangePicker,
  RangeGroup,
  NasSelectField,
} from '../../../../../../../../../../components/ReduxForm';
import {
  types,
  symbols,
  statuses,
  filterFormAttributeLabels,
} from '../../constants';

const FORM_NAME = 'userTradingActivityFilter';

class FilterForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func,
    reset: PropTypes.func,
    change: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    accounts: PropTypes.array,
  };

  static defaultProps = {
    handleSubmit: null,
    reset: null,
    accounts: [],
  };

  handleReset = () => {
    this.props.reset();
  };

  handleApplyFilters = (values) => {
    const variables = {
      ...values,
      ...(values.tradeId && { tradeId: Number(values.tradeId) }),
    };

    this.props.onSubmit(variables);
  };

  render() {
    const {
      submitting,
      handleSubmit,
      accounts,
      change,
    } = this.props;

    return (
      <form className="filter-row" onSubmit={handleSubmit(this.handleApplyFilters)}>
        <Field
          name="tradeId"
          type="number"
          label={I18n.t(filterFormAttributeLabels.trade.label)}
          placeholder={I18n.t(filterFormAttributeLabels.trade.placeholder)}
          component={InputField}
          className="filter-row__big"
        />
        <Field
          name="loginIds"
          label={I18n.t(filterFormAttributeLabels.loginIds)}
          component={NasSelectField}
          placeholder={I18n.t('COMMON.ALL')}
          multiple
          className="filter-row__medium"
        >
          {accounts.map(acc => (
            <option key={acc.login} value={acc.login}>
              {acc.login.toString()}
            </option>
          ))}
        </Field>
        <Field
          name="cmd"
          label={I18n.t(filterFormAttributeLabels.type)}
          component={SelectField}
          className="filter-row__medium"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {types.map(type => (
            <option key={type.value} value={type.value}>
              {I18n.t(type.label)}
            </option>
          ))}
        </Field>
        <Field
          name="symbol"
          label={I18n.t(filterFormAttributeLabels.symbol)}
          component={SelectField}
          className="filter-row__medium"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {symbols.map(symbol => (
            <option key={symbol.value} value={symbol.value}>
              {I18n.t(symbol.label)}
            </option>
          ))}
        </Field>
        <RangeGroup
          className="filter-row__big"
          label={I18n.t(filterFormAttributeLabels.volume)}
        >
          <Field
            name="volumeFrom"
            type="number"
            placeholder="0"
            component={InputField}
          />
          <Field
            name="volumeTo"
            type="number"
            placeholder="0"
            component={InputField}
          />
        </RangeGroup>
        <Field
          name="status"
          label={I18n.t(filterFormAttributeLabels.status)}
          component={SelectField}
          className="filter-row__medium"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {statuses.map(status => (
            <option key={status.value} value={status.value}>
              {I18n.t(status.label)}
            </option>
          ))}
        </Field>
        <div className="form-group filter-row__medium">
          <label>
            {I18n.t(filterFormAttributeLabels.openTimeRange)}
          </label>
          <DateRangePicker
            anchorDirection="left"
            enableOutsideDays
            isOutsideRange={() => false}
            showDefaultInputIcon
            hideKeyboardShortcutsPanel
            customArrowIcon="-"
            keepOpenOnDateSelect
            firstDayOfWeek={1}
            change={change}
            withTime
            periodKeys={{
              start: 'openTimeStart',
              end: 'openTimeEnd',
            }}
          />
        </div>
        <div className="form-group filter-row__medium">
          <label>
            {I18n.t(filterFormAttributeLabels.closeTimeRange)}
          </label>
          <DateRangePicker
            enableOutsideDays
            isOutsideRange={() => false}
            showDefaultInputIcon
            hideKeyboardShortcutsPanel
            customArrowIcon="-"
            keepOpenOnDateSelect
            firstDayOfWeek={1}
            change={change}
            withTime
            periodKeys={{
              start: 'closeTimeStart',
              end: 'closeTimeEnd',
            }}
          />
        </div>
        <div className="filter-row__button-block">
          <button
            disabled={submitting}
            className="btn btn-default"
            onClick={this.handleReset}
            type="reset"
          >
            {I18n.t('COMMON.RESET')}
          </button>
          <button
            disabled={submitting}
            className="btn btn-primary"
            type="submit"
          >
            {I18n.t('COMMON.APPLY')}
          </button>
        </div>
      </form>
    );
  }
}

export default (reduxForm({
  form: FORM_NAME,
  // validate,
})(FilterForm));
