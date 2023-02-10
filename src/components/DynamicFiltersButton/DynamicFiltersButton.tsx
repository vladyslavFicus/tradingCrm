import React, { useEffect } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { pick } from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { State } from 'types';
import usePrevious from 'hooks/usePrevious';
import { withStorage } from 'providers/StorageProvider';
import Select from 'components/Select';
import { Button } from 'components/Buttons';
import './DynamicFiltersButton.scss';

type Props = {
  className: string,
  storageKey: string,
  storage: Storage,

  // Filters to show as default if no any filters to render wasn't provided
  defaultFilters: Array<string>,

  // Object of filter fields list to render inside select
  filters: Record<string, string>,
};

/**
 * Button to render filters list and save rendered filters to persistent storage to render same list in the future
 * if page will be change or something else while filters will be cleared
 */
const DynamicFiltersButton = (props: Props) => {
  const {
    className,
    filters,
    defaultFilters,
    storage,
    storageKey,
  } = props;

  const history = useHistory();
  const { state } = useLocation<State>();
  const prevFiltersFields = usePrevious(state?.filtersFields);
  const currentFilters = state?.filtersFields || [];

  const getFilters = () => {
    // Set default filters fields list if no filters fields list was applied before and the current history operation
    // isn't "replace" state to prevent set default filters list if user cleared select with filters list
    if (!currentFilters.length && history.action !== 'REPLACE') {
      const storedFilters = storage.get(storageKey) || [];
      const filtersFields = storedFilters.length ? storedFilters : defaultFilters;

      history.replace({
        state: {
          ...state,
          filtersFields,
        },
      });
    }

    // Save to persistent storage if list with filters fields was changed
    if (storageKey && prevFiltersFields !== currentFilters) {
      storage.set(storageKey, currentFilters);
    }
  };

  useEffect(() => {
    getFilters();
  }, [state?.filtersFields]);

  /**
   * Handler on change event from select with filter fields list
   * It's also clearing applied filter values if new filters list excluded field with value.
   *
   * @param value
   */
  const onChange = (value: string) => {
    history.replace({
      state: {
        ...state,
        filters: pick(state?.filters, value),
        filtersFields: value,
      },
    });
  };

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

export default compose(
  React.memo,
  withStorage,
)(DynamicFiltersButton);
