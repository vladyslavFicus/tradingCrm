import React from 'react';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import { createValidator } from '../../../../../../utils/validator';
import { filterLabels } from '../../../../../../constants/user';
import createDynamicForm, { FilterItem, FilterField, TYPES, SIZES } from '../../../../../../components/DynamicFilters';
import { deskTypes, defaultDeskFlag } from '../constants';

const FORM_NAME = 'desksListGridFilter';
const DynamicFilters = createDynamicForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: () => createValidator({
    searchBy: 'string',
    office: 'string',
    deskType: 'string',
    defaultDesk: 'string',
  }, filterLabels, false),
});

const DesksGridFilter = ({
  onSubmit,
  onReset,
  disabled,
  offices,
  officesLoading,
}) => (
  <DynamicFilters
    allowSubmit={disabled}
    allowReset={disabled}
    onSubmit={onSubmit}
    onReset={onReset}
  >
    <FilterItem label={I18n.t(filterLabels.searchValue)} size={SIZES.medium} type={TYPES.input} default>
      <FilterField
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
      disabled={officesLoading || (Array.isArray(offices) && offices.length === 0)}
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
      label={I18n.t(filterLabels.deskType)}
      size={SIZES.medium}
      type={TYPES.nas_select}
      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
      default
    >
      <FilterField name="deskType">
        {deskTypes.map(({ label, value }) => (
          <option key={value} value={value}>
            {I18n.t(label)}
          </option>
        ))}
      </FilterField>
    </FilterItem>
    <FilterItem
      label={I18n.t(filterLabels.defaultDesk)}
      size={SIZES.medium}
      type={TYPES.nas_select}
      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
      default
    >
      <FilterField name="defaultDeskFlag">
        {defaultDeskFlag.map(({ label, value }) => (
          <option key={value} value={value}>
            {I18n.t(label)}
          </option>
        ))}
      </FilterField>
    </FilterItem>
  </DynamicFilters>
);

DesksGridFilter.propTypes = {
  disabled: PropTypes.bool,
  onReset: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  offices: PropTypes.arrayOf(PropTypes.branchHierarchyType).isRequired,
  officesLoading: PropTypes.bool.isRequired,
};

DesksGridFilter.defaultProps = {
  disabled: false,
};

export default connect(state => ({
  form: FORM_NAME,
  currentValues: getFormValues(FORM_NAME)(state),
}))(DesksGridFilter);
