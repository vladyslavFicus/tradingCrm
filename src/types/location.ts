import { Location } from 'history';
import { Sort } from './sort';

export interface State<TFilters = Record<string, any>> {
  filters?: TFilters,
  filtersFields?: TFilters,
  sorts?: undefined | Sort[],
}

export interface LocationState<TFilters = Record<string, any>> extends Location<State<TFilters>> {}
