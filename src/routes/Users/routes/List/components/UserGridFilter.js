import React, { Component, PropTypes } from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import classNames from 'classnames';
import { createValidator } from 'utils/validator';
import moment from 'moment';
import DateTime from 'react-datetime';
import countryList from 'country-list';
import { statusesLabels } from 'constants/user';

const FORM_NAME = 'userFilter';
const userGridValuesSelector = formValueSelector(FORM_NAME);

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
};

const validator = createValidator({
  //todo add validator
}, attributeLabels, false);

class UserGridFilter extends Component {
  handleDateTimeChange = (callback) => (value) => {
    callback(value ? value.format('YYYY-MM-DD') : '');
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues.endDate
      ? current.isSameOrBefore(moment(currentValues.endDate))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues.startDate
      ? current.isSameOrAfter(moment(currentValues.startDate))
      : true;
  };

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
      reset,
      availableTags,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col-md-3">
            <span className="font-size-20">Transactions</span>
          </div>
        </div>

        <div className="well">
          <div className="row">
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-4">
                  <Field
                    name="searchValue"
                    type="text"
                    label='Search by'
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
                      .map((key) => <option key={key} value={key}>{countries[key]}</option>)
                    }
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field
                    name="city"
                    type="text"
                    label='City'
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
                          placeholder='0'
                          component={this.renderTextField}
                        />
                      </div>
                      <div className="col-md-5">
                        <Field
                          name="ageTo"
                          type="text"
                          placeholder='150'
                          component={this.renderTextField}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <Field
                    name="affiliateId"
                    type="text"
                    label='Affiliate'
                    placeholder={attributeLabels.affiliateId}
                    component={this.renderTextField}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-2">
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
                <div className="col-md-2">
                  <Field
                    name="tags"
                    label={attributeLabels.tags}
                    emptyOptionLabel="Any"
                    component={this.renderSelectField}
                  >
                    {availableTags.map((tag) =>
                      <option key={tag.label+tag.priority+tag.value} value={tag.value}>{tag.value}</option>)
                    }
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field
                    name="segments"
                    label={attributeLabels.segments}
                    emptyOptionLabel="Any"
                    component={this.renderSelectField}
                  >
                  </Field>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Registration date range</label>
                    <div className="row">
                      <div className="col-md-5">
                        <Field
                          name="registrationDateFrom"
                          placeholder={attributeLabels.registrationDateFrom}
                          component={this.renderDateField}
                          isValidDate={this.startDateValidator}
                        />
                      </div>
                      <div className="col-md-5">
                        <Field
                          name="registrationDateFrom"
                          placeholder={attributeLabels.registrationDateFrom}
                          component={this.renderDateField}
                          isValidDate={this.endDateValidator}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-2">
              <div className="form-group">
                <br/>
                <button disabled={submitting}
                        className="btn btn-default btn-sm margin-inline font-weight-700"
                        onClick={reset}> Reset
                </button>
                {' '}
                <button disabled={submitting}
                        className="btn btn-primary btn-sm margin-inline font-weight-700"
                        type="submit"> Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  renderTextField = ({ input, label, placeholder, type, disabled, meta: { touched, error }, inputClassName }) => {
    return <div className={classNames('form-group', { 'has-danger': touched && error })}>
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
    </div>;
  };

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
        <option>{emptyOptionLabel}</option>
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

const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(UserGridFilter);

export default connect((state) => {
  return {
    currentValues: {
      keyword: userGridValuesSelector(state, 'keyword'),
      country: userGridValuesSelector(state, 'country'),
      city: userGridValuesSelector(state, 'city'),
      ageFrom: userGridValuesSelector(state, 'ageFrom'),
      ageTo: userGridValuesSelector(state, 'ageTo'),
      currency: userGridValuesSelector(state, 'currency'),
      affiliateId: userGridValuesSelector(state, 'affiliateId'),
      status: userGridValuesSelector(state, 'status'),
      tags: userGridValuesSelector(state, 'tags'),
      segments: userGridValuesSelector(state, 'segments'),
      registrationDateFrom: userGridValuesSelector(state, 'registrationDateFrom'),
      registrationDateTo: userGridValuesSelector(state, 'registrationDateTo'),
    },
  };
})(FilterForm);
