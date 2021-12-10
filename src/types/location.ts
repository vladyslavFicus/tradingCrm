import { Location } from 'history';
import { Filters, Sort } from 'types';

export interface State {
  filters?: null | Filters
  sorts?: [] | undefined | Sort[],
}
export interface LocationState extends Location<State> { };
