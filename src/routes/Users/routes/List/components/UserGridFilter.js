import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import countryList from 'country-list';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { InputField, SelectField, DateTimeField, NasSelectField } from '../../../../../components/ReduxForm';
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

class UserGridFilter extends Component {
  static propTypes = {
    currentValues: PropTypes.shape({
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
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    currentValues: {
      keyword: '',
      countries: [],
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
    submitting: false,
    pristine: false,
    handleSubmit: null,
    reset: null,
    disabled: false,
  };

  startDateValidator = toAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[toAttribute]
      ? current.isSameOrBefore(moment(currentValues[toAttribute]))
      : true;
  };

  endDateValidator = fromAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[fromAttribute]
      ? current.isSameOrAfter(moment(currentValues[fromAttribute]))
      : true;
  };

  handleReset = () => {
    this.props.reset();
    this.props.onReset();
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="well">
          <div className="filter-row">
            <div className="filter-row__big">
              <Field
                name="searchValue"
                type="text"
                label={filterLabels.searchValue}
                placeholder="Name, username, phone, email..."
                component={InputField}
                position="vertical"
                iconLeftClassName="nas nas-search_icon"
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="countries"
                label={filterLabels.country}
                component={NasSelectField}
                position="vertical"
                multiple
              >
                {Object
                  .keys(countries)
                  .map(key => <option key={key} value={key}>{countries[key]}</option>)
                }
              </Field>
            </div>
            <div className="filter-row__small">
              <Field
                name="city"
                type="text"
                label="City"
                placeholder={filterLabels.city}
                component={InputField}
                position="vertical"
              />
            </div>
            <div className="filter-row__small">
              <div className="form-group">
                <label>Age</label>
                <div className="range-group">
                  <Field
                    name="ageFrom"
                    type="text"
                    placeholder="20"
                    component="input"
                    className="form-control"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="ageTo"
                    type="text"
                    placeholder="30"
                    component="input"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="filter-row__small">
              <div className="form-group">
                <label>Balance</label>
                <div className="range-group">
                  <Field
                    name="balanceFrom"
                    type="text"
                    placeholder="100"
                    component="input"
                    className="form-control"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="balanceTo"
                    type="text"
                    placeholder="150"
                    component="input"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="filter-row__small">
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
            <div className="filter-row__medium">
              <Field
                name="affiliateId"
                type="text"
                label="Affiliate"
                placeholder={filterLabels.affiliateId}
                component={InputField}
                position="vertical"
              />
            </div>
            <div className="filter-row__small">
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
            <div className="filter-row__small">
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
            <div className="filter-row__small">
              <Field
                name="segments"
                label={filterLabels.segments}
                component={SelectField}
                position="vertical"
              >
                <option value="">Any</option>
              </Field>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>Registration date range</label>
                <div className="range-group">
                  <Field
                    name="registrationDateFrom"
                    component={DateTimeField}
                    isValidDate={this.startDateValidator('registrationDateTo')}
                    position="vertical"
                    className={null}
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="registrationDateTo"
                    component={DateTimeField}
                    isValidDate={this.endDateValidator('registrationDateFrom')}
                    position="vertical"
                    className={null}
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
                  Reset
                </button>
                <button
                  disabled={submitting || (disabled && pristine)}
                  className="btn btn-primary"
                  type="submit"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const FORM_NAME = 'userListGridFilter';
const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: createValidator({
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
  }, filterLabels, false),
})(UserGridFilter);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
