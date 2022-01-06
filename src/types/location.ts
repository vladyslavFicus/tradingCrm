import { Location } from 'history';
import { Sort } from 'types';

export interface State<TFilters = {}, TSort = Sort> {
  filters?: TFilters
  sorts?: [] | undefined | TSort[],
}
export interface LocationState<TFilters = {}> extends Location<State<TFilters>> { }
