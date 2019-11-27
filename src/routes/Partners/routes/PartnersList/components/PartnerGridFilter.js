import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form';
import I18n from 'i18n-js';
import { InputField, DateRangePicker, NasSelectField } from '../../../../../components/ReduxForm';
import { createValidator, translateLabels } from '../../../../../utils/validator';
import { attributeLabels } from '../constants';
import { statusesLabels, statuses } from '../../../../../constants/operators';
import countries from '../../../../../utils/countryList';

class PartnerGridFilter extends Component {
  static propTypes = {
    filterValues: PropTypes.object,
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    invalid: PropTypes.bool,
  };

  static defaultProps = {
    invalid: true,
    handleSubmit: null,
    submitting: false,
    filterValues: {},
  };

  handleSubmit = () => this.props.onSubmit(this.props.filterValues);

  startDateValidator = (current) => {
    const { filterValues } = this.props;

    return filterValues.endDate
      ? current.isSameOrBefore(moment(filterValues.endDate))
      : true;
  };

  endDateValidator = (current) => {
    const { filterValues } = this.props;

    return filterValues.startDate
      ? current.isSameOrAfter(moment(filterValues.startDate))
      : true;
  };

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();
  };

  render() {
    const {
      submitting,
      handleSubmit,
      invalid,
      change,
    } = this.props;

    return (
      <form className="filter-row" onSubmit={handleSubmit(this.handleSubmit)}>
        <Field
          name="searchBy"
          type="text"
          label={I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.SEARCH_BY')}
          placeholder={I18n.t(attributeLabels.keyword)}
          component={InputField}
          inputAddon={<i className="icon icon-search" />}
          id="operators-list-filters-search"
          className="filter-row__medium"
        />
        <Field
          name="country"
          label={I18n.t(attributeLabels.country)}
          component={NasSelectField}
          type="text"
          placeholder={I18n.t('COMMON.SELECT_OPTION.COUNTRY')}
          className="filter-row__medium"
          withAnyOption
        >
          {Object
            .keys(countries)
            .map(key => <option key={key} value={key}>{countries[key]}</option>)
          }
        </Field>
        <Field
          name="status"
          label={I18n.t(attributeLabels.status)}
          component={NasSelectField}
          type="text"
          placeholder={I18n.t('COMMON.SELECT_OPTION.STATUS')}
          className="filter-row__medium"
          withAnyOption
        >
          {Object
            .keys(statusesLabels)
            .map(status => <option key={status} value={status}>{I18n.t(statusesLabels[status])}</option>)
          }
        </Field>
        <div className="form-group filter-row__medium">
          <label>
            {I18n.t('PARTNERS.LIST.FILTER_FORM.LABEL.REGISTRATION_DATE_RANGE')}
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
            withTime={false}
            periodKeys={{
              start: 'registrationDateFrom',
              end: 'registrationDateTo',
            }}
          />
        </div>
        <div className="filter-row__button-block">
          <button
            disabled={submitting}
            className="btn btn-default"
            onClick={this.handleReset}
            type="button"
          >
            {I18n.t('COMMON.RESET')}
          </button>
          <button
            disabled={submitting || invalid}
            className="btn btn-primary"
            type="submit"
            id="operators-list-filters-apply-button"
          >
            {I18n.t('COMMON.APPLY')}
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'partnersListGridFilter',
  touchOnChange: true,
  validate: createValidator({
    keyword: 'string',
    country: ['string', `in:${Object.keys(countries).join()}`],
    status: ['string', `in:${Object.keys(statuses).join()}`],
    registrationDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
    registrationDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
  }, translateLabels(attributeLabels), false),
})(PartnerGridFilter);
