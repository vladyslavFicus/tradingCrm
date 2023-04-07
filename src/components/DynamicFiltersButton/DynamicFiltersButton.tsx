import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import { pick } from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { State } from 'types';
import Select from 'components/Select';
import { Button } from 'components/Buttons';
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

  const history = useHistory();
  const { state } = useLocation<State>();
  const currentFilters = state?.filtersFields || [];

  /**
   * Handler on change event from select with filter fields list
   * It's also clearing applied filter values if new filters list excluded field with value.
   *
   * @param value
   */
  const onChange = useCallback((value: string) => {
    history.replace({
      state: {
        ...state,
        filters: pick(state?.filters, value),
        filtersFields: [...new Set(value)],
      },
    });
  }, [history, state]);

  return (
    <Select
      // @ts-ignore Select component write by js
      multiple
      value={currentFilters}
      onRealtimeChange={onChange}
      customClassName={className}
      customSelectBlockClassName="DynamicFiltersButton__select-block"
      customSelectBlockContainerClassName="DynamicFiltersButton__select-block-container"
      customArrowComponent={
        <Button primary>{I18n.t('COMMON.BUTTONS.ADD_FILTER')}</Button>
      }
    >
      {Object.keys(filters).map(key => (
        <option key={key} value={key}>{filters[key]}</option>
      ))}
    </Select>
  );
};

export default React.memo(DynamicFiltersButton);
