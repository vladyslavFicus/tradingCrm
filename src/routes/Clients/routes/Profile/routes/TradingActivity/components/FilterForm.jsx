import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import I18n from 'i18n-js';
import moment from 'moment';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { accountTypes } from 'constants/accountTypes';
import {
  InputField,
  DateRangePicker,
  RangeGroup,
  NasSelectField,
} from 'components/ReduxForm';
import { statuses as operatorsStasuses } from 'constants/operators';
import {
  types,
  symbols,
  statuses,
  filterFormAttributeLabels,
} from '../constants';

const FORM_NAME = 'userTradingActivityFilter';

class FilterForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func,
    change: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    accounts: PropTypes.array,
    onReset: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    operators: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.tradingActivityOriginalAgent),
        error: PropTypes.object,
      }),
    }).isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    handleSubmit: null,
    accounts: [],
  };

  handleApplyFilters = (values) => {
    const variables = {
      ...values,
      ...(values.tradeId && { tradeId: Number(values.tradeId) }),
      ...(values.volumeFrom && { volumeFrom: Number(values.volumeFrom) }),
      ...(values.volumeTo && { volumeTo: Number(values.volumeTo) }),
    };

    this.props.onSubmit(variables);
  };

  handleDateChange = (name, value) => {
    this.props.change(name, value ? moment(value).format() : '');
  }

  resetForm = () => {
    const { reset, onReset } = this.props;

    onReset();
    reset();
  }

  render() {
    const {
      submitting,
      handleSubmit,
      accounts,
      disabled,
      operators: {
        operators,
        loading: operatorsLoading,
      },
      pristine,
    } = this.props;

    const originalAgents = get(operators, 'data.content') || [];
    const disabledOriginalAgentField = get(operators, 'error') || operatorsLoading;

    return (
      <form className="filter-row" onSubmit={handleSubmit(this.handleApplyFilters)}>
        <Field
          name="tradeId"
          type="number"
          label={I18n.t(filterFormAttributeLabels.trade.label)}
          placeholder={I18n.t(filterFormAttributeLabels.trade.placeholder)}
          component={InputField}
          className="filter-row__big"
          disabled={disabled}
        />
        <Field
          name="loginIds"
          label={I18n.t(filterFormAttributeLabels.loginIds)}
          component={NasSelectField}
          placeholder={I18n.t('COMMON.ALL')}
          multiple
          className="filter-row__medium"
          disabled={disabled}
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
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          component={NasSelectField}
          className="filter-row__medium"
          disabled={disabled}
          withAnyOption
        >
          {types.map(type => (
            <option key={type.value} value={type.value}>
              {I18n.t(type.label)}
            </option>
          ))}
        </Field>
        <Field
          name="symbol"
          label={I18n.t(filterFormAttributeLabels.symbol)}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          component={NasSelectField}
          className="filter-row__medium"
          disabled={disabled}
          withAnyOption
        >
          {symbols.map(symbol => (
            <option key={symbol.value} value={symbol.value}>
              {I18n.t(symbol.label)}
            </option>
          ))}
        </Field>
        <Field
          name="agentIds"
          label={I18n.t(filterFormAttributeLabels.agentIds)}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          component={NasSelectField}
          multiple
          className="filter-row__medium"
          disabled={disabledOriginalAgentField}
        >
          {originalAgents.map(({ fullName, uuid, operatorStatus }) => (
            <option
              key={uuid}
              value={uuid}
              className={operatorStatus === operatorsStasuses.INACTIVE
                || operatorStatus === operatorsStasuses.CLOSE
                ? 'color-inactive' : ''}
            >
              {fullName}
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
            step="0.01"
            component={InputField}
            disabled={disabled}
          />
          <Field
            name="volumeTo"
            type="number"
            placeholder="0"
            step="0.01"
            component={InputField}
            disabled={disabled}
          />
        </RangeGroup>
        <Field
          name="status"
          label={I18n.t(filterFormAttributeLabels.status)}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          component={NasSelectField}
          className="filter-row__medium"
          disabled={disabled}
          withAnyOption
        >
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
            change={this.handleDateChange}
            withTime
            periodKeys={{
              start: 'openTimeStart',
              end: 'openTimeEnd',
            }}
            disabled={disabled}
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
            change={this.handleDateChange}
            withTime
            periodKeys={{
              start: 'closeTimeStart',
              end: 'closeTimeEnd',
            }}
            disabled={disabled}
          />
        </div>
        <Field
          name="tradeType"
          label={I18n.t(filterFormAttributeLabels.accountType)}
          placeholder={I18n.t('COMMON.ALL')}
          component={NasSelectField}
          className="filter-row__medium"
          disabled={disabled}
          withAnyOption
        >
          {accountTypes.map(({ label, value }) => (
            <option key={value} value={value}>
              {I18n.t(label)}
            </option>
          ))}
        </Field>
        <div className="filter-row__button-block">
          <button
            disabled={pristine || submitting}
            className="btn btn-default"
            onClick={this.resetForm}
            type="button"
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

export default reduxForm({
  form: FORM_NAME,
})(FilterForm);
