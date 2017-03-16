import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import classNames from 'classnames';
import { createValidator } from 'utils/validator';
import moment from 'moment';
import DateTime from 'react-datetime';
import countryList from 'country-list';
import { statusesLabels } from 'constants/user';
import config from 'config/index';

const tags = config.nas.tags.reduce((result, item) => ({
  ...result,
  [item.value]: item.label,
}), {});
const currencies = config.nas.currencies.supported || [];
const countries = countryList().getData().reduce((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});
const attributeLabels = {
  keyword: 'Name, username, phone, email...',
  country: 'Country',
  city: 'City',
  ageFrom: 'Age from',
  ageTo: 'Age to',
  currency: 'Currency',
  affiliateId: 'Affiliate ID',
  status: 'Status',
  tags: 'Tags',
  segments: 'Segments',
  registrationDateFrom: 'registrationDateFrom',
  registrationDateTo: 'registrationDateTo',
  balanceFrom: 'balanceFrom',
  balanceTo: 'balanceTo',
};

const validator = createValidator({
  keyword: 'string',
  country: `in:,${Object.keys(countries).join(',')}`,
  currency: `in:,${currencies.join(',')}`,
  ageFrom: 'integer',
  ageTo: 'integer',
  affiliateId: 'string',
  status: 'string',
  tags: `in:,${Object.keys(tags).join(',')}`,
  segments: 'string',
  registrationDateFrom: 'string',
  registrationDateTo: 'string',
  balanceFrom: 'integer',
  balanceTo: 'integer',
}, attributeLabels, false);

class UserGridFilter extends Component {
  static propTypes = {
    filterValues: PropTypes.object,
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    submitting: PropTypes.bool,
  };

  handleDateTimeChange = callback => (value) => {
    callback(value ? value.format('YYYY-MM-DDTHH:mm:00') : '');
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

  handleSubmit = () => {
    const data = { ...this.props.filterValues };

    if (data.countries) {
      data.countries = [data.countries];
    }
    if (data.tags) {
      data.tags = [data.tags];
    }
    if (data.statuses) {
      data.statuses = [data.statuses];
    }

    return this.props.onSubmit(data);
  };

  renderTextField = ({ input, label, placeholder, type, disabled, meta: { touched, error }, inputClassName }) => {
    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <div className="input-group">
          <label>{label}</label>
          <input
            {...input}
            disabled={disabled}
            type={type}
            className={classNames('form-control', inputClassName, { 'has-danger': touched && error })}
            placeholder={placeholder}
            title={placeholder}
          />
        </div>
      </div>
    );
  };

  renderQueryField = ({ input, label, placeholder, type, disabled, meta: { touched, error }, inputClassName }) => {
    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <label>{label}</label>
        <div className="form-input-icon">
          <i className="icmn-search" />
          <input
            {...input}
            disabled={disabled}
            type={type}
            className={classNames('form-control', inputClassName, { 'has-danger': touched && error })}
            placeholder={placeholder}
            title={placeholder}
          />
        </div>
      </div>
    );
  };

  renderSelectField = ({ input, children, label, meta: { touched, error }, emptyOptionLabel }) => {
    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <label>{label}</label>
        <select
          {...input}
          className={classNames('form-control form-control-sm', { 'has-danger': touched && error })}
        >
          <option value="">{emptyOptionLabel}</option>
          {children}
        </select>
      </div>
    );
  };

  renderDateField = ({ input, placeholder, disabled, meta: { touched, error }, isValidDate }) => {
    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <div className="input-group">
          <DateTime
            dateFormat="MM/DD/YYYY"
            timeFormat="HH:mm"
            onChange={this.handleDateTimeChange(input.onChange)}
            value={input.value ? moment(input.value) : null}
            closeOnSelect
            inputProps={{
              disabled,
              placeholder,
            }}
            isValidDate={isValidDate}
          />
          <span className="input-group-addon">
            <i className="fa fa-calendar" />
          </span>
        </div>
      </div>
    );
  };

  render() {
    const {
      submitting,
      handleSubmit,
      reset,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col-md-3">
            <span className="font-size-20">Players</span>
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
                    label="Search by"
                    placeholder={attributeLabels.keyword}
                    component={this.renderQueryField}
                  />
                </div>
                <div className="col-md-2">
                  <Field
                    name="countries"
                    label={attributeLabels.country}
                    emptyOptionLabel="Any"
                    component={this.renderSelectField}
                  >
                    {Object
                      .keys(countries)
                      .map(key => <option key={key} value={key}>{countries[key]}</option>)
                    }
                  </Field>
                </div>
                <div className="col-md-1">
                  <Field
                    name="city"
                    type="text"
                    label="City"
                    placeholder={attributeLabels.city}
                    component={this.renderTextField}
                  />
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <div className="row">
                      <div className="col-md-5">
                        <Field
                          name="ageFrom"
                          type="text"
                          placeholder="20"
                          component={this.renderTextField}
                        />
                      </div>
                      <div className="col-md-1 dash-after-input" />
                      <div className="col-md-5">
                        <Field
                          name="ageTo"
                          type="text"
                          placeholder="30"
                          component={this.renderTextField}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="form-label">Balance</label>
                    <div className="row">
                      <div className="col-md-5">
                        <Field
                          name="balanceFrom"
                          type="text"
                          placeholder="100"
                          component={this.renderTextField}
                        />
                      </div>
                      <div className="col-md-1 dash-after-input" />
                      <div className="col-md-5">
                        <Field
                          name="balanceTo"
                          type="text"
                          placeholder="150"
                          component={this.renderTextField}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <Field
                    name="currency"
                    label={attributeLabels.currency}
                    emptyOptionLabel="Any"
                    component={this.renderSelectField}
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2">
                  <Field
                    name="affiliateId"
                    type="text"
                    label="Affiliate"
                    placeholder={attributeLabels.affiliateId}
                    component={this.renderTextField}
                  />
                </div>
                <div className="col-md-1">
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
                <div className="col-md-1">
                  <Field
                    name="tags"
                    label={attributeLabels.tags}
                    emptyOptionLabel="Any"
                    component={this.renderSelectField}
                  >
                    {Object.keys(tags).map(item => (
                      <option key={tags[item]} value={item}>
                        {item}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-1">
                  <Field
                    name="segments"
                    label={attributeLabels.segments}
                    emptyOptionLabel="Any"
                    component={this.renderSelectField}
                  />
                </div>
                <div className="col-md-5">
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
    );
  }
}

export default reduxForm({
  form: 'userListGridFilter',
  validate: validator,
})(UserGridFilter);
