import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { createValidator } from 'utils/validator';
import classNames from 'classnames';
import countryList from 'country-list';
import { statusesLabels, statuses } from 'constants/operators';
import moment from 'moment';
import DateTime from 'react-datetime';
import config from 'config/index';

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
  country: ['string', 'in:' + Object.keys(countries).join('')],
  status: ['string', 'in:' + Object.keys(statuses).join()],
  department: ['string', 'in:' + departments.map(role => role.value).join()],
  role: ['string', 'in:' + roles.map(role => role.value).join()],
  registrationDateFrom: 'string',
  registrationDateTo: 'string',
}, attributeLabels, false);

class OperatorGridFilter extends Component {
  handleSubmit = () => {
    console.log('implement handleSubmit');
  };

  handleDateTimeChange = (callback) => (value) => {
    callback(value ? value.format('YYYY-MM-DD') : '');
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

  render() {
    const {
      submitting,
      handleSubmit,
      reset,
      onCreateOperatorClick,
    } = this.props;

    return (
      <div>
        <div className="row margin-bottom-20">
          <div className="col-md-3">
            <span className="font-size-20">Operators</span>
          </div>
          <div className="col-md-3 col-md-offset-6">
            <button className="btn btn-default-outline" onClick={onCreateOperatorClick}>
              + New operator
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="row margin-bottom-20">
            <div className="col-md-3">
              <span className="font-size-20">Operators</span>
            </div>
          </div>

          <div className="well">
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-3">
                    <Field
                      name="searchValue"
                      type="text"
                      label='Search by'
                      placeholder={attributeLabels.keyword}
                      component={this.renderQueryField}
                    />
                  </div>
                  <div className="col-md-3">
                    <Field
                      name="countries"
                      label={attributeLabels.country}
                      emptyOptionLabel="Any"
                      component={this.renderSelectField}
                    >
                      {Object
                        .keys(countries)
                        .map((key) => <option key={key} value={key}>{countries[key]}</option>)
                      }
                    </Field>
                  </div>
                  <div className="col-md-3">
                    <Field
                      name="statuses"
                      label={attributeLabels.status}
                      emptyOptionLabel="Any"
                      component={this.renderSelectField}
                    >
                      {Object.keys(statusesLabels).map(status => (
                        <option key={status} value={status}>
                          {statusesLabels[status]}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <Field
                      name="department"
                      label={attributeLabels.department}
                      component={this.renderSelectField}
                      position="vertical"
                      emptyOptionLabel="Any"
                      showErrorMessage={false}
                      children={[
                        departments.map(({ label, value }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )),
                      ]}
                    />
                  </div>
                  <div className="col-md-3">
                    <Field
                      name="role"
                      label={attributeLabels.role}
                      component={this.renderSelectField}
                      position="vertical"
                      emptyOptionLabel="Any"
                      showErrorMessage={false}
                      children={[
                        roles.map(({ label, value }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )),
                      ]}
                    />
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Registration date range</label>
                      <div className="row">
                        <div className="col-md-5">
                          <Field
                            name="registrationDateFrom"
                            component={this.renderDateField}
                            isValidDate={this.startDateValidator}
                          />
                        </div>
                        <div className="col-md-5">
                          <Field
                            name="registrationDateTo"
                            component={this.renderDateField}
                            isValidDate={this.endDateValidator}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group">
                      <button
                        disabled={submitting}
                        className="btn btn-default btn-sm margin-inline font-weight-700"
                        onClick={reset}
                      >
                        Reset
                      </button>
                      <button
                        disabled={submitting}
                        className="btn btn-primary btn-sm margin-inline font-weight-700"
                        type="submit"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
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

  renderSelectField = ({ input, children, label, meta: { touched, error }, emptyOptionLabel }) => {
    return <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <label>{label}</label>
      <select
        {...input}
        className={classNames('form-control form-control-sm', { 'has-danger': touched && error })}
      >
        <option value="">{emptyOptionLabel}</option>
        {children}
      </select>
    </div>;
  };

  renderSelectField = ({ input, children, label, meta: { touched, error }, emptyOptionLabel }) => {
    return <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <label>{label}</label>
      <select
        {...input}
        className={classNames('form-control form-control-sm', { 'has-danger': touched && error })}
      >
        <option value="">{emptyOptionLabel}</option>
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

export default reduxForm({
  form: 'operatorsListGridFilter',
  validate: validator,
})(OperatorGridFilter);
