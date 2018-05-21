import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../utils/validator';
import createDynamicForm, { FilterItem, FilterField, TYPES, SIZES } from '../../../../../components/DynamicFilters';
import renderLabel from '../../../../../utils/renderLabel';
import { filterLabels, filterPlaceholders } from '../constants';

const FORM_NAME = 'cmsGameGridViewFilter';
const DynamicFilters = createDynamicForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: createValidator({
    searchBy: 'string',
  }, filterLabels, false),
});

const CampaignGridViewFilter = (props) => {
  const {
    onSubmit,
    onReset,
    disabled,
    initialValues,
  } = props;

  return (
    <DynamicFilters
      allowSubmit={disabled}
      allowReset={disabled}
      onSubmit={onSubmit}
      onReset={onReset}
      initialValues={initialValues}
    >
      <FilterItem label={filterLabels.searchBy} size={SIZES.big} type={TYPES.input} default>
        <FilterField
          id="campaign-search-field"
          name="searchBy"
          label={I18n.t(filterLabels.searchBy)}
          placeholder={I18n.t(filterPlaceholders.searchBy)}
          type="text"
        />
      </FilterItem>
    </DynamicFilters>
  );
};

CampaignGridViewFilter.propTypes = {
  disabled: PropTypes.bool,
  onReset: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.string).isRequired,
};
CampaignGridViewFilter.defaultProps = {
  disabled: false,
};

export default CampaignGridViewFilter;
