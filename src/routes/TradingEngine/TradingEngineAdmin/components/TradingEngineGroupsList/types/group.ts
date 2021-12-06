import { QueryResult } from 'react-apollo';
import { QueryVariables } from 'types/queryVariables';

export interface GroupSecurity {
  name: string
}

export interface GroupSecurities {
  security: GroupSecurity
}

export interface Group {
  groupName: string,
  brand: string,
  marginCallLevel: number,
  stopoutLevel: number,
  groupSecurities: GroupSecurities[]
}

export interface GroupsListData {
  tradingEngineGroupsList: {
    content: Group[],
    page: number,
    size: number,
    totalElements: number,
    last: boolean,
    loading: boolean,
    refetch: () => void,
    number: number,
  },
}

export interface GroupsQueryResult extends QueryResult<GroupsListData, QueryVariables> {
  loadMore: (variables: QueryVariables) => GroupsListData;
}

