import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import I18n from 'i18n-js';
import countryList from 'utils/countryList';
import { createValidator } from 'utils/validator';
import languages from 'constants/languageNames';
import { filterLabels } from 'constants/user';
import createDynamicForm, {
  FilterItem,
  FilterField,
  TYPES,
  SIZES,
} from '../../DynamicFilters';

const FORM_NAME = 'rulesListGridFilter';
const DynamicFilters = createDynamicForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: () => createValidator({
    searchBy: 'string',
    country: `in:,${Object.keys(countryList).join()}`,
    language: 'string',
  }, filterLabels, false),
});

const RulesGridFilters = ({
  onSubmit,
  onReset,
  disabled,
  initialValues,
}) => (
  <DynamicFilters
    initialValues={initialValues}
    allowSubmit={disabled}
    allowReset={disabled}
    onSubmit={onSubmit}
    onReset={onReset}
    countries={countryList}
  >
    <FilterItem label={I18n.t(filterLabels.searchValue)} size={SIZES.medium} type={TYPES.input} default>
      <FilterField
        name="createdByOrUuid"
        placeholder="Operator UUID, Rule UUID"
        type="text"
      />
    </FilterItem>

    <FilterItem
      label={I18n.t(filterLabels.country)}
      size={SIZES.medium}
      type={TYPES.nas_select}
      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
      default
      withAnyOption
    >
      <FilterField name="country">
        {Object
          .keys(countryList)
          .map(key => <option key={key} value={key}>{countryList[key]}</option>)
        }
      </FilterField>
    </FilterItem>

    <FilterItem
      label={I18n.t(filterLabels.language)}
      size={SIZES.medium}
      type={TYPES.nas_select}
      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
      default
      withAnyOption
    >
      <FilterField name="language">
        {languages.map(({ languageName, languageCode }) => (
          <option key={languageCode} value={languageCode}>
            {I18n.t(languageName)}
          </option>
        ))}
      </FilterField>
    </FilterItem>
  </DynamicFilters>
);

RulesGridFilters.propTypes = {
  disabled: PropTypes.bool,
  onReset: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};

RulesGridFilters.defaultProps = {
  disabled: false,
  initialValues: null,
};

export default connect(state => ({
  form: FORM_NAME,
  currentValues: getFormValues(FORM_NAME)(state),
}))(RulesGridFilters);
