import { Query, QueryPageable } from 'types/query';

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
  tradingEngineGroupsList: QueryPageable<Group[]>
}

export interface GroupsListVariables {
  args: {
    keyword?: string
    page: {
      from: number
      size: number
      sorts?: []
    }
  }
}

export interface GroupsQueryResult extends Query<GroupsListData, GroupsListVariables> { }