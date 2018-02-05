import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { InputField, SelectField, DateRangePicker } from '../../../../../components/ReduxForm';
import { createValidator, translateLabels } from '../../../../../utils/validator';
import { attributeLabels } from '../constants';
import { statusesLabels, statuses } from '../../../../../constants/operators';
import config from '../../../../../config';
import countries from '../../../../../utils/countryList';

const { availableDepartments: departments, availableRoles: roles } = config;

class OperatorGridFilter extends Component {
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
      <div className="well">
        <form className="filter-row" onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="filter-row__medium">
            <Field
              name="searchBy"
              type="text"
              label={I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.SEARCH_BY')}
              placeholder={I18n.t(attributeLabels.keyword)}
              component={InputField}
              position="vertical"
              iconLeftClassName="nas nas-search_icon"
              id="operators-list-filters-search"
            />
          </div>
          <div className="filter-row__medium">
            <Field
              name="country"
              label={I18n.t(attributeLabels.country)}
              component={SelectField}
              position="vertical"
            >
              <option value="">Any</option>
              {Object
                .keys(countries)
                .map(key => <option key={key} value={key}>{countries[key]}</option>)
              }
            </Field>
          </div>
          <div className="filter-row__medium">
            <Field
              name="status"
              label={I18n.t(attributeLabels.status)}
              component={SelectField}
              position="vertical"
            >
              <option value="">Any</option>
              {Object.keys(statusesLabels).map(status => (
                <option key={status} value={status}>
                  {statusesLabels[status]}
                </option>
              ))}
            </Field>
          </div>
          <div className="filter-row__medium">
            <div className="form-group">
              <label>
                {I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.REGISTRATION_DATE_RANGE')}
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
          </div>
          <div className="filter-row__button-block">
            <div className="button-block-container">
              <button
                disabled={submitting}
                className="btn btn-default"
                onClick={this.handleReset}
                type="reset"
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
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'operatorsListGridFilter',
  touchOnChange: true,
  validate: createValidator({
    keyword: 'string',
    country: ['string', `in:${Object.keys(countries).join()}`],
    status: ['string', `in:${Object.keys(statuses).join()}`],
    department: ['string', `in:${departments.map(role => role.value).join()}`],
    role: ['string', `in:${roles.map(role => role.value).join()}`],
    registrationDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
    registrationDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
  }, translateLabels(attributeLabels), false),
})(OperatorGridFilter);
