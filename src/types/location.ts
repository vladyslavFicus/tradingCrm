import { Location } from 'history';

export interface Filters {
  keyword: string;
}

export interface Sorts {
  column?: string;
  direction?: 'ASC' | 'DESC';
}

export interface LocationState extends Location {
  filters?: null | Filters
  sorts?: [] | undefined | Sorts[],
};
