import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
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
    registrationDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    registrationDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    tradingBalanceFrom: 'integer',
    tradingBalanceFromTo: 'integer',
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
      segments: PropTypes.string,
      registrationDateFrom: PropTypes.string,
      registrationDateTo: PropTypes.string,
      balanceFrom: PropTypes.number,
      balanceTo: PropTypes.number,
    }),
    disabled: PropTypes.bool,
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    countries: PropTypes.object.isRequired,
    teams: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    desks: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    branchesLoading: PropTypes.bool.isRequired,
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
      currencies,
      countries,
      teams,
      desks,
      branchesLoading,
    } = this.props;

    return (
      <DynamicFilters
        allowSubmit={disabled}
        allowReset={disabled}
        onSubmit={onSubmit}
        onReset={onReset}
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
          disabled={branchesLoading}
          default
        >
          <FilterField name="desks">
            {desks.map(({ uuid, name }) => (
              <option key={uuid} value={uuid}>
                {name}
              </option>
            ))}
          </FilterField>
        </FilterItem>

        <FilterItem
          label={I18n.t(filterLabels.teams)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')}
          disabled={branchesLoading}
          default
        >
          <FilterField name="teams">
            {teams.map(({ uuid, name }) => (
              <option key={uuid} value={uuid}>
                {name}
              </option>
            ))}
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
                {I18n.t(statusesLabels[status])}
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
            name="tradingBalanceFrom"
            type="number"
            normalize={floatNormalize}
          />
          <FilterField
            name="tradingBalanceTo"
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
      </DynamicFilters>
    );
  }
}

export default connect(state => ({
  form: FORM_NAME,
  currentValues: getFormValues(FORM_NAME)(state),
}))(UserGridFilter);
