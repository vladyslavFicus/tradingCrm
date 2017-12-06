import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { createValidator } from '../../../../../utils/validator';
import { statusesLabels, filterLabels } from '../../../../../constants/user';
import AdvancedFilters, { FilterItem, FilterField, FilterActions } from '../../../../../components/AdvancedFilters';

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
    invalid: PropTypes.bool.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
    })).isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    countries: PropTypes.object.isRequired,
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
      invalid,
      tags,
      currencies,
      countries,
    } = this.props;

    return (
      <div className="well">
        <AdvancedFilters onSubmit={handleSubmit(onSubmit)}>
          <FilterItem label={filterLabels.searchValue} size="big" type="input" default>
            <FilterField
              id="users-list-search-field"
              name="searchValue"
              placeholder="Name, login, phone, email..."
              type="text"
            />
          </FilterItem>

          <FilterItem label={filterLabels.country} size="medium" type="nas:select" default>
            <FilterField name="countries" multiple>
              {Object
                .keys(countries)
                .map(key => <option key={key} value={key}>{countries[key]}</option>)
              }
            </FilterField>
          </FilterItem>

          <FilterItem label={filterLabels.city} size="small" type="input" default>
            <FilterField name="city" type="text" />
          </FilterItem>

          <FilterItem label={filterLabels.age} size="small" type="range:input" default>
            <FilterField name="ageFrom" type="text" />
            <FilterField name="ageTo" type="text" />
          </FilterItem>

          <FilterItem label={filterLabels.balance} size="small" type="range:input" default>
            <FilterField name="balanceFrom" type="text" />
            <FilterField name="balanceTo" type="text" />
          </FilterItem>

          <FilterItem label={filterLabels.currencies} size="small" type="select" default>
            <FilterField name="currencies">
              <option value="">Any</option>
              {currencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </FilterField>
          </FilterItem>

          <FilterItem label={filterLabels.affiliateId} size="medium" type="input">
            <FilterField name="affiliateId" type="text" />
          </FilterItem>

          <FilterItem label={filterLabels.status} size="small" type="select">
            <FilterField name="statuses">
              <option value="">Any</option>
              {Object.keys(statusesLabels).map(status => (
                <option key={status} value={status}>
                  {statusesLabels[status]}
                </option>
              ))}
            </FilterField>
          </FilterItem>

          <FilterItem label={filterLabels.tags} size="small" type="select">
            <FilterField name="tags">
              <option value="">Any</option>
              {
                tags.length > 0 &&
                tags.map(tag => (
                  <option key={`${tag.value}`} value={tag.value}>
                    {tag.label}
                  </option>
                ))
              }
            </FilterField>
          </FilterItem>

          <FilterItem label={filterLabels.segments} size="small" type="select">
            <FilterField name="segments">
              <option value="">Any</option>
            </FilterField>
          </FilterItem>

          <FilterItem label={filterLabels.registrationDate} size="big" type="range:date">
            <FilterField
              utc
              name="registrationDateFrom"
              isValidDate={this.startDateValidator('registrationDateTo')}
            />
            <FilterField
              utc
              name="registrationDateTo"
              isValidDate={this.endDateValidator('registrationDateFrom')}
            />
          </FilterItem>

          <FilterActions
            onResetClick={this.handleReset}
            resetDisabled={submitting || (disabled && pristine)}
            submitDisabled={submitting || (disabled && pristine) || invalid}
          />
        </AdvancedFilters>
      </div>
    );
  }
}

const FORM_NAME = 'userListGridFilter';
const FilterForm = reduxForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: (values, props) => createValidator({
    keyword: 'string',
    country: `in:,${Object.keys(props.countries).join()}`,
    currencies: `in:,${props.currencies.join()}`,
    ageFrom: 'integer',
    ageTo: 'integer',
    affiliateId: 'string',
    status: 'string',
    tags: `in:,${props.tags.map(tag => tag.value).join()}`,
    segments: 'string',
    registrationDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    registrationDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    balanceFrom: 'integer',
    balanceTo: 'integer',
  }, filterLabels, false),
})(UserGridFilter);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
