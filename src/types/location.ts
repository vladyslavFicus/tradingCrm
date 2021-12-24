import { Location } from 'history';
import { Sort } from 'types';

export interface State<TFilters = null, TSort = []> {
  filters?: TFilters,
  sorts?: [] | undefined | TSort[] | Sort,
}

export interface LocationState<TFilters> extends Location<State<TFilters>> { }
