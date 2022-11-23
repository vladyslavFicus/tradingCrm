import { QueryResult, ApolloQueryResult } from '@apollo/client';

export interface Pageable<TContent> {
  content: TContent[],
  page: number,
  size: number,
  totalElements: number,
  last: boolean,
  number: number,
}

export interface Query<TData, TVariables = void> extends QueryResult<TData, TVariables> {
  loadMore: (variables: TVariables) => TData,
  refetch: (args?: TVariables) => Promise<ApolloQueryResult<TData>>,
}
