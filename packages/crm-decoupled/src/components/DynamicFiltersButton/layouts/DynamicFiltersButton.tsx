// @ts-nocheck Select component write by js
import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components';
import Select from 'components/Select';
import useDynamicFiltersButton from 'components/DynamicFiltersButton/hooks/useDynamicFiltersButton';
import './DynamicFiltersButton.scss';

type Props = {
  className: string,
  // Object of filter fields list to render inside select
  filters: Record<string, string>,
};

/**
 * Button to render filters list and save rendered filters to persistent storage to render same list in the future
 * if page will be change or something else while filters will be cleared
 */
const DynamicFiltersButton = (props: Props) => {
  const { className, filters } = props;

  const { currentFilters, onChange } = useDynamicFiltersButton();

  return (
    <Select
      multiple
      value={currentFilters}
      onRealtimeChange={onChange}
      customClassName={className}
      customSelectBlockClassName="DynamicFiltersButton__select-block"
      customSelectBlockContainerClassName="DynamicFiltersButton__select-block-container"
      customArrowComponent={(
        <Button
          primary
          data-testid="DynamicFiltersButton-addFilterButton"
        >
          {I18n.t('COMMON.BUTTONS.ADD_FILTER')}
        </Button>
      )}
    >
      {Object.keys(filters).map(key => (
        <option key={key} value={key}>{filters[key]}</option>
      ))}
    </Select>
  );
};

export default React.memo(DynamicFiltersButton);
