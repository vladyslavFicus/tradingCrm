import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import countryList from 'country-list';
import { reduxForm, Field } from 'redux-form';
import { InputField, SelectField, DateTimeField } from '../../../../../components/ReduxForm';
import { createValidator } from '../../../../../utils/validator';
import renderLabel from '../../../../../utils/renderLabel';
import { statusesLabels, statuses, rolesLabels, departmentsLabels } from '../../../../../constants/operators';
import config from '../../../../../config/index';

const { availableDepartments: departments, availableRoles: roles } = config;
const countries = countryList().getData().reduce((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});
const attributeLabels = {
  keyword: 'Name, Phone, Email, UUID...',
  country: 'Country',
  status: 'Status',
  department: 'Department',
  role: 'Role',
  registrationDateFrom: 'registrationDateFrom',
  registrationDateTo: 'registrationDateTo',
};

const validator = createValidator({
  keyword: 'string',
  country: ['string', `in:${Object.keys(countries).join()}`],
  status: ['string', `in:${Object.keys(statuses).join()}`],
  department: ['string', `in:${departments.map(role => role.value).join()}`],
  role: ['string', `in:${roles.map(role => role.value).join()}`],
  registrationDateFrom: 'string',
  registrationDateTo: 'string',
}, attributeLabels, false);

class OperatorGridFilter extends Component {
  static propTypes = {
    filterValues: PropTypes.object,
    reset: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
  };

  handleSubmit = () => {
    return this.props.onSubmit(this.props.filterValues);
  };

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
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="filter-row">
            <div className="filter-row__medium">
              <Field
                name="searchBy"
                type="text"
                label="Search by"
                placeholder={attributeLabels.keyword}
                component={InputField}
                position="vertical"
                iconLeftClassName="nas nas-search_icon"
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="country"
                label={attributeLabels.country}
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
                label={attributeLabels.status}
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
              <Field
                name="department"
                label={attributeLabels.department}
                component={SelectField}
                position="vertical"
              >
                <option value="">Any</option>
                {departments.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {renderLabel(label, departmentsLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="role"
                label={attributeLabels.role}
                component={SelectField}
                position="vertical"
              >
                <option value="">Any</option>
                {roles.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {renderLabel(label, rolesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>Registration date range</label>
                <div className="range-group">
                  <Field
                    name="registration_date_from"
                    component={DateTimeField}
                    isValidDate={this.startDateValidator}
                    position="vertical"
                    className={null}
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="registration_date_to"
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
                  className="btn btn-default"
                  onClick={this.handleReset}
                  type="reset"
                >
                  Reset
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary"
                  type="submit"
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

export default reduxForm({
  form: 'operatorsListGridFilter',
  validate: validator,
})(OperatorGridFilter);
