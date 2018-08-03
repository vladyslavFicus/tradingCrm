import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../utils/validator';
import { statusesLabels, filterLabels } from '../../../../../constants/user';
import createDynamicForm, { FilterItem, FilterField, TYPES, SIZES } from '../../../../../components/DynamicFilters';
import { floatNormalize } from '../../../../../utils/inputNormalize';
import { acquisitionStatuses } from './constants';

const FORM_NAME = 'userListGridFilter';
const DynamicFilters = createDynamicForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: (_, props) => createValidator({
    keyword: 'string',
    country: `in:,${Object.keys(props.countries).join()}`,
    status: 'string',
    acquisitionStatus: 'string',
    teams: 'string',
    desks: 'string',
    tags: `in:,${props.tags.map(tag => tag.value).join()}`,
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
      balanceFrom: PropTypes.number,
      balanceTo: PropTypes.number,
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
        <FilterItem label={I18n.t(filterLabels.searchValue)} size={SIZES.big} type={TYPES.input} default>
          <FilterField
            id="users-list-search-field"
            name="searchValue"
            placeholder="Name, email, ID..."
            type="text"
          />
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.country)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="countries" multiple>
            {Object
              .keys(countries)
              .map(key => <option key={key} value={key}>{countries[key]}</option>)
            }
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.desks)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')}
          default
        >
          <FilterField name="desks">
            {[]}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.teams)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')}
          default
        >
          <FilterField name="teams">
            {[]}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.offices)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')}
          default
        >
          <FilterField name="desks">
            {[]}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.status)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="status">
            {Object.keys(statusesLabels).map(status => (
              <option key={status} value={status}>
                {statusesLabels[status]}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.acquisitionStatus)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="acquisitionStatus">
            {acquisitionStatuses.map(item => (
              <option key={item.value} value={item.value}>
                {I18n.t(item.label)}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.balance)}
          size={SIZES.small}
          type={TYPES.range_input}
          placeholder="0.00/0.00"
          default
        >
          <FilterField
            name="balanceFrom"
            type="number"
            normalize={floatNormalize}
          />
          <FilterField
            name="balanceTo"
            type="number"
            normalize={floatNormalize}
          />
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.registrationDate)}
          size={SIZES.big}
          type={TYPES.range_date}
          placeholder={`${I18n.t('COMMON.DATE_OPTIONS.START_DATE')}/${I18n.t('COMMON.DATE_OPTIONS.END_DATE')}`}
          default
        >
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

        <FilterItem
          label={I18n.t(filterLabels.tags)}
          size={SIZES.small}
          type={TYPES.nas_select}
          placeholder={tags.length === 0
            ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
            : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
          }
          default
        >
          <FilterField name="tags" multiple>
            {tags.map(tag => (
              <option key={`${tag.value}`} value={tag.value}>
                {tag.label}
              </option>
            ))}
          </FilterField>
        </FilterItem>
      </DynamicFilters>
    );
  }
}

export default connect(state => ({
  form: FORM_NAME,
  currentValues: getFormValues(FORM_NAME)(state),
}))(UserGridFilter);
