import { Location } from 'history';

export interface LocationState extends Location {
  filters?: null | {},
  sorts?: [],
};
