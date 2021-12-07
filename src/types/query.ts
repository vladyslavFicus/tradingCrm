import { QueryResult } from 'react-apollo';

export interface QueryPageable<TContent> {
  content: TContent,
  page: number,
  size: number,
  totalElements: number,
  last: boolean,
  number: number,
}

export interface Query<TData, TVariables> extends QueryResult<TData, TVariables> {
  loadMore: (variables: TVariables) => TData;
}