import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { salesStatuses } from '../../../../../constants/salesStatuses';
import { createValidator } from '../../../../../utils/validator';
import { filterLabels } from '../../../../../constants/user';
import createDynamicForm, { FilterItem, FilterField, TYPES, SIZES } from '../../../../../components/DynamicFilters';

const FORM_NAME = 'leadsListGridFilter';
const DynamicFilters = createDynamicForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: (_, props) => createValidator({
    nameOrEmailOrId: 'string',
    country: `in:,${Object.keys(props.countries).join()}`,
    status: 'string',
    teams: 'string',
    desks: 'string',
    registrationDateStart: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    registrationDateEnd: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
  }, filterLabels, false),
});

class UserGridFilter extends Component {
  static propTypes = {
    currentValues: PropTypes.shape({
      nameOrEmailOrId: PropTypes.string,
      country: PropTypes.string,
      status: PropTypes.string,
      desks: PropTypes.string,
      teams: PropTypes.string,
      registrationDateStart: PropTypes.string,
      registrationDateEnd: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
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
      currencies,
      countries,
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
            name="nameOrEmailOrId"
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
          label={I18n.t(filterLabels.salesStatus)}
          size={SIZES.medium}
          type={TYPES.nas_select}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          default
        >
          <FilterField name="salesStatus">
            {Object.keys(salesStatuses).map(status => (
              <option key={status} value={status}>
                {I18n.t(salesStatuses[status])}
              </option>
            ))}
          </FilterField>
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
            name="registrationDateStart"
            isValidDate={this.startDateValidator('registrationDateEnd')}
            timePresets
            withTime
            closeOnSelect={false}
          />
          <FilterField
            utc
            name="registrationDateEnd"
            isValidDate={this.endDateValidator('registrationDateStart')}
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
