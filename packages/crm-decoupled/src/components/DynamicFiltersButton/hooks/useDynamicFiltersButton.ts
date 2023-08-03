import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pick } from 'lodash';
import { State } from 'types';

type UseDynamicFiltersButton = {
  currentFilters: Array<String>,
  onChange: (value: string) => void,
};

const useDynamicFiltersButton = (): UseDynamicFiltersButton => {
  const navigate = useNavigate();
  const state = useLocation().state as State;
  const currentFilters = state?.filtersFields || [];

  /**
   * Handler on change event from select with filter fields list
   * It's also clearing applied filter values if new filters list excluded field with value.
   *
   * @param value
   */
  const onChange = useCallback((value: string) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: pick(state?.filters, value),
        filtersFields: [...new Set(value)],
      },
    });
  }, [state]);

  return {
    currentFilters,
    onChange,
  };
};

export default useDynamicFiltersButton;
