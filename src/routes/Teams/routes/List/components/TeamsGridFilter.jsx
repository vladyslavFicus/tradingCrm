import React from 'react';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import { createValidator } from '../../../../../utils/validator';
import { filterLabels } from '../../../../../constants/user';
import createDynamicForm, { FilterItem, FilterField, TYPES, SIZES } from '../../../../../components/DynamicFilters';

const FORM_NAME = 'teamsListGridFilter';
const DynamicFilters = createDynamicForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: () => createValidator({
    searchBy: 'string',
    office: 'string',
    desk: 'string',
  }, filterLabels, false),
});

const TeamsGridFilter = ({
  onSubmit,
  onReset,
  disabled,
  offices,
  desks,
  hierarchyBranchesLoading,
}) => (
  <DynamicFilters
    allowSubmit={disabled}
    allowReset={disabled}
    onSubmit={onSubmit}
    onReset={onReset}
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
      label={I18n.t(filterLabels.office)}
      size={SIZES.medium}
      type={TYPES.nas_select}
      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
      disabled={hierarchyBranchesLoading || (Array.isArray(offices) && offices.length === 0)}
      default
    >
      <FilterField name="officeUuid">
        {offices.map(({ name, uuid }) => (
          <option key={uuid} value={uuid}>
            {name}
          </option>
        ))}
      </FilterField>
    </FilterItem>
    <FilterItem
      label={I18n.t(filterLabels.desk)}
      size={SIZES.medium}
      type={TYPES.nas_select}
      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
      disabled={hierarchyBranchesLoading || (Array.isArray(desks) && desks.length === 0)}
      default
    >
      <FilterField name="deskUuid">
        {desks.map(({ name, uuid }) => (
          <option key={uuid} value={uuid}>
            {name}
          </option>
        ))}
      </FilterField>
    </FilterItem>
  </DynamicFilters>
);

TeamsGridFilter.propTypes = {
  disabled: PropTypes.bool,
  onReset: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  offices: PropTypes.arrayOf(PropTypes.branchHierarchyType).isRequired,
  desks: PropTypes.arrayOf(PropTypes.branchHierarchyType).isRequired,
  hierarchyBranchesLoading: PropTypes.bool.isRequired,
};

TeamsGridFilter.defaultProps = {
  disabled: false,
};

export default connect(state => ({
  form: FORM_NAME,
  currentValues: getFormValues(FORM_NAME)(state),
}))(TeamsGridFilter);
