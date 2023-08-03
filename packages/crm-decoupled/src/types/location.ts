import { Path } from 'react-router-dom';
import { SelectedFilterSet } from './selectedFilterSet';
import { Sort } from './sort';

interface Location<T> extends Path {
  state: T,
  key: string,
}

export interface State<TFilters = Record<string, any>, TFiltersFields = Array<String>> {
  filters?: TFilters,
  filtersFields?: TFiltersFields,
  sorts?: undefined | Sort[],
  selectedFilterSet?: SelectedFilterSet,
}

export interface LocationState<TFilters = Record<string, any>> extends Location<State<TFilters>> {}
