import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../utils/validator';
import { statusesLabels, filterLabels } from '../../../../../constants/user';
import createDynamicForm, { FilterItem, FilterField, TYPES, SIZES } from '../../../../../components/DynamicFilters';

const FORM_NAME = 'userListGridFilter';
const DynamicFilters = createDynamicForm({
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
});

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
    }),
    disabled: PropTypes.bool,
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
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
    currentValues: {},
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

  render() {
    const {
      onSubmit,
      onReset,
      disabled,
      tags,
      currencies,
      countries,
    } = this.props;

    return (
      <DynamicFilters
        allowSubmit={disabled}
        allowReset={disabled}
        onSubmit={onSubmit}
        onReset={onReset}
        tags={tags}
        currencies={currencies}
        countries={countries}
      >
        <FilterItem label={filterLabels.searchValue} size={SIZES.big} type={TYPES.input} default>
          <FilterField
            id="users-list-search-field"
            name="searchValue"
            placeholder="Name, login, phone, email..."
            type="text"
          />
        </FilterItem>

        <FilterItem label={filterLabels.country} size={SIZES.medium} type={TYPES.nas_select} default>
          <FilterField name="countries" multiple>
            {Object
              .keys(countries)
              .map(key => <option key={key} value={key}>{countries[key]}</option>)
            }
          </FilterField>
        </FilterItem>

        <FilterItem label={filterLabels.city} size={SIZES.small} type={TYPES.input} default>
          <FilterField name="city" type="text" />
        </FilterItem>

        <FilterItem label={filterLabels.age} size={SIZES.small} type={TYPES.range_input} default>
          <FilterField name="ageFrom" type="text" />
          <FilterField name="ageTo" type="text" />
        </FilterItem>

        <FilterItem label={filterLabels.balance} size={SIZES.small} type={TYPES.range_input} default>
          <FilterField name="balanceFrom" type="text" />
          <FilterField name="balanceTo" type="text" />
        </FilterItem>

        <FilterItem label={filterLabels.currencies} size={SIZES.small} type={TYPES.select}>
          <FilterField name="currencies">
            <option value="">{I18n.t('COMMON.ANY')}</option>
            {currencies.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem label={filterLabels.affiliateId} size={SIZES.medium} type={TYPES.input}>
          <FilterField name="affiliateId" type="text" />
        </FilterItem>

        <FilterItem label={filterLabels.status} size={SIZES.small} type={TYPES.select}>
          <FilterField name="statuses">
            <option value="">{I18n.t('COMMON.ANY')}</option>
            {Object.keys(statusesLabels).map(status => (
              <option key={status} value={status}>
                {statusesLabels[status]}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem label={filterLabels.tags} size={SIZES.small} type={TYPES.select}>
          <FilterField name="tags">
            <option value="">{I18n.t('COMMON.ANY')}</option>
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

        <FilterItem label={filterLabels.segments} size={SIZES.small} type={TYPES.select}>
          <FilterField name="segments">
            <option value="">{I18n.t('COMMON.ANY')}</option>
          </FilterField>
        </FilterItem>

        <FilterItem label={filterLabels.registrationDate} size={SIZES.big} type={TYPES.range_date}>
          <FilterField
            utc
            name="registrationDateFrom"
            isValidDate={this.startDateValidator('registrationDateTo')}
            timePresets
            withTime
            closeOnSelect={false}
          />
          <FilterField
            utc
            name="registrationDateTo"
            isValidDate={this.endDateValidator('registrationDateFrom')}
            timePresets
            withTime
            closeOnSelect={false}
          />
        </FilterItem>
      </DynamicFilters>
    );
  }
}

export default connect(state => ({
  form: FORM_NAME,
  currentValues: getFormValues(FORM_NAME)(state),
}))(UserGridFilter);
