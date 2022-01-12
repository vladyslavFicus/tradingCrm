import { Location } from 'history';
import { Sort } from './sort';

export interface State<TFilters = {}> {
  filters?: TFilters,
  sorts?: undefined | Sort[],
}

export interface LocationState<TFilters = {}> extends Location<State<TFilters>> { }
