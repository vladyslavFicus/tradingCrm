import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import I18n from 'i18n-js';
import { filterLabels } from 'constants/user';
import createDynamicForm, { FilterItem, FilterField, TYPES, SIZES } from 'components/DynamicFilters';
import { createValidator } from 'utils/validator';
import countries from 'utils/countryList';

const FORM_NAME = 'officesListGridFilter';
const DynamicFilters = createDynamicForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: () => createValidator({
    searchBy: 'string',
    country: `in:,${Object.keys(countries).join()}`,
  }, filterLabels, false),
});

const OfficesGridFilter = ({
  onSubmit,
  onReset,
  disabled,
}) => (
  <DynamicFilters
    allowSubmit={disabled}
    allowReset={disabled}
    onSubmit={onSubmit}
    onReset={onReset}
    countries={countries}
  >
    <FilterItem label={I18n.t(filterLabels.searchValue)} size={SIZES.medium} type={TYPES.input} default>
      <FilterField
        id="users-list-search-field"
        name="keyword"
        placeholder={I18n.t('COMMON.NAME')}
        type="text"
      />
    </FilterItem>

    <FilterItem
      label={I18n.t(filterLabels.country)}
      size={SIZES.medium}
      type={TYPES.nas_select}
      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
      default
    >
      <FilterField name="country">
        {Object
          .keys(countries)
          .map(key => <option key={key} value={key}>{countries[key]}</option>)
        }
      </FilterField>
    </FilterItem>
  </DynamicFilters>
);

OfficesGridFilter.propTypes = {
  disabled: PropTypes.bool,
  onReset: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

OfficesGridFilter.defaultProps = {
  disabled: false,
};

export default connect(state => ({
  form: FORM_NAME,
  currentValues: getFormValues(FORM_NAME)(state),
}))(OfficesGridFilter);
