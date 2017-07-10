import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTime from 'react-datetime';
import countryList from 'country-list';
import { reduxForm, Field } from 'redux-form';
import classNames from 'classnames';
import { InputField, SelectField } from '../../../../../components/ReduxForm';
import { createValidator } from '../../../../../utils/validator';
import { statusesLabels, filterLabels } from '../../../../../constants/user';
import config from '../../../../../config/index';

const tags = config.nas.brand.tags.reduce((result, item) => ({
  ...result,
  [item.value]: item.label,
}), {});
const currencies = config.nas.currencies.supported || [];
const countries = countryList().getData().reduce((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});
const validator = createValidator({
  keyword: 'string',
  country: `in:,${Object.keys(countries).join()}`,
  currencies: `in:,${currencies.join()}`,
  ageFrom: 'integer',
  ageTo: 'integer',
  affiliateId: 'string',
  status: 'string',
  tags: `in:,${Object.keys(tags).join()}`,
  segments: 'string',
  registrationDateFrom: 'string',
  registrationDateTo: 'string',
  balanceFrom: 'integer',
  balanceTo: 'integer',
}, filterLabels, false);

class UserGridFilter extends Component {
  static propTypes = {
    filterValues: PropTypes.shape({
      keyword: PropTypes.string,
      country: PropTypes.string,
      currency: PropTypes.string,
      ageFrom: PropTypes.string,
      ageTo: PropTypes.string,
      affiliateId: PropTypes.string,
      status: PropTypes.string,
      tags: PropTypes.string,
      segments: PropTypes.string,
      registrationDateFrom: PropTypes.string,
      registrationDateTo: PropTypes.string,
      balanceFrom: PropTypes.string,
      balanceTo: PropTypes.string,
    }).isRequired,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    handleSubmit: PropTypes.func,
    reset: PropTypes.func,
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };
  static defaultProps = {
    filterValues: {
      keyword: '',
      country: '',
      currency: '',
      ageFrom: '',
      ageTo: '',
      affiliateId: '',
      status: '',
      tags: '',
      segments: '',
      registrationDateFrom: '',
      registrationDateTo: '',
      balanceFrom: '',
      balanceTo: '',
    },
  };

  handleDateTimeChange = callback => (value) => {
    callback(value ? value.format('YYYY-MM-DDTHH:mm:00') : '');
  };

  startDateValidator = toAttribute => (current) => {
    const { filterValues } = this.props;

    return filterValues[toAttribute]
      ? current.isSameOrBefore(moment(filterValues[toAttribute]))
      : true;
  };

  endDateValidator = fromAttribute => (current) => {
    const { filterValues } = this.props;

    return filterValues[fromAttribute]
      ? current.isSameOrAfter(moment(filterValues[fromAttribute]))
      : true;
  };

  handleReset = () => {
    this.props.reset();
    this.props.onReset();
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
      pristine,
      handleSubmit,
      onSubmit,
      disabled,
    } = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="well">
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-3">
                    <Field
                      name="searchValue"
                      type="text"
                      label={filterLabels.searchValue}
                      placeholder="Name, username, phone, email..."
                      component={this.renderQueryField}
                    />
                  </div>
                  <div className="col-md-2">
                    <Field
                      name="countries"
                      label={filterLabels.country}
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
                  <div className="col-md-1">
                    <Field
                      name="city"
                      type="text"
                      label="City"
                      placeholder={filterLabels.city}
                      component={InputField}
                      position="vertical"
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
                            component={InputField}
                            position="vertical"
                          />
                        </div>
                        <div className="col-md-1 dash-after-input" />
                        <div className="col-md-5">
                          <Field
                            name="ageTo"
                            type="text"
                            placeholder="30"
                            component={InputField}
                            position="vertical"
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
                            component={InputField}
                            position="vertical"
                          />
                        </div>
                        <div className="col-md-1 dash-after-input" />
                        <div className="col-md-5">
                          <Field
                            name="balanceTo"
                            type="text"
                            placeholder="150"
                            component={InputField}
                            position="vertical"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <Field
                      name="currencies"
                      label={filterLabels.currencies}
                      component={SelectField}
                      position="vertical"
                    >
                      <option value="">Any</option>
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
                      placeholder={filterLabels.affiliateId}
                      component={InputField}
                      position="vertical"
                    />
                  </div>
                  <div className="col-md-1">
                    <Field
                      name="statuses"
                      label={filterLabels.status}
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
                  <div className="col-md-1">
                    <Field
                      name="tags"
                      label={filterLabels.tags}
                      component={SelectField}
                      position="vertical"
                    >
                      <option value="">Any</option>
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
                      label={filterLabels.segments}
                      component={SelectField}
                      position="vertical"
                    >
                      <option value="">Any</option>
                    </Field>
                  </div>
                  <div className="col-md-5">
                    <div className="form-group">
                      <label className="form-label">Registration date range</label>
                      <div className="row">
                        <div className="col-md-5">
                          <Field
                            name="registrationDateFrom"
                            component={this.renderDateField}
                            isValidDate={this.startDateValidator('registrationDateTo')}
                          />
                        </div>
                        <div className="col-md-5">
                          <Field
                            name="registrationDateTo"
                            component={this.renderDateField}
                            isValidDate={this.endDateValidator('registrationDateFrom')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <button
                        disabled={submitting || (disabled && pristine)}
                        className="btn btn-default btn-sm margin-inline font-weight-700"
                        onClick={this.handleReset}
                        type="reset"
                      >
                        Reset
                      </button>
                      <button
                        disabled={submitting || (disabled && pristine)}
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
}

export default reduxForm({
  form: 'userListGridFilter',
  validate: validator,
})(UserGridFilter);
