import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../utils/validator';
import createDynamicForm, { FilterItem, FilterField, TYPES, SIZES } from '../../../../../components/DynamicFilters';
import renderLabel from '../../../../../utils/renderLabel';
import { statusLabels, filterLabels, platformLabels, freeSpinsStatusLabels } from '../constants';

const FORM_NAME = 'cmsGameGridViewFilter';
const DynamicFilters = createDynamicForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: createValidator({
    provider: 'string',
    platform: 'string',
    technology: 'string',
    freeSpinsStatus: 'string',
  }, filterLabels, false),
});

const CmsGamesGridViewFilter = (props) => {
  const {
    onSubmit,
    onReset,
    disabled,
    providers,
    platforms,
    technologies,
    freeSpinsStatuses,
    statuses,
    initialValues,
  } = props;

  return (
    <DynamicFilters
      allowSubmit={disabled}
      allowReset={disabled}
      onSubmit={onSubmit}
      onReset={onReset}
      statuses={statuses}
      initialValues={initialValues}
    >
      <FilterItem label={I18n.t(filterLabels.provider)} size={SIZES.small} type={TYPES.select} default>
        <FilterField name="provider">
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {providers.map(provider => (
            <option key={provider.name} value={provider.name}>
              {provider.name}
            </option>
          ))}
        </FilterField>
      </FilterItem>

      <FilterItem label={I18n.t(filterLabels.platform)} size={SIZES.small} type={TYPES.select} default>
        <FilterField name="platform">
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(platforms).map(platform => (
            <option key={platform} value={platform}>
              {renderLabel(platform, platformLabels)}
            </option>
          ))}
        </FilterField>
      </FilterItem>

      <FilterItem label={I18n.t(filterLabels.technology)} size={SIZES.small} type={TYPES.select} default>
        <FilterField name="technology">
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(technologies).map(technology => (
            <option key={technology} value={technology}>
              {technology}
            </option>
          ))}
        </FilterField>
      </FilterItem>

      <FilterItem label={I18n.t(filterLabels.freeSpinsStatus)} size={SIZES.small} type={TYPES.select} default>
        <FilterField name="freeSpinsStatus">
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(freeSpinsStatuses).map(status => (
            <option key={status} value={status}>
              {renderLabel(status, freeSpinsStatusLabels)}
            </option>
          ))}
        </FilterField>
      </FilterItem>

      <FilterItem label={I18n.t(filterLabels.status)} size={SIZES.small} type={TYPES.select} default>
        <FilterField name="status">
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(statuses).map(status => (
            <option key={status} value={status}>
              {renderLabel(status, statusLabels)}
            </option>
          ))}
        </FilterField>
      </FilterItem>
    </DynamicFilters>
  );
};

CmsGamesGridViewFilter.propTypes = {
  providers: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
  platforms: PropTypes.objectOf(PropTypes.string).isRequired,
  technologies: PropTypes.objectOf(PropTypes.string).isRequired,
  freeSpinsStatuses: PropTypes.objectOf(PropTypes.string).isRequired,
  statuses: PropTypes.objectOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool,
  onReset: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.string).isRequired,
};
CmsGamesGridViewFilter.defaultProps = {
  disabled: false,
};

export default CmsGamesGridViewFilter;
