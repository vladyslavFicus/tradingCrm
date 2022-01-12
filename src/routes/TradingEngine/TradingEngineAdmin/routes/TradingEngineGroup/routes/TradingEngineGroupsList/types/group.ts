import { Query, Pageable } from 'types/query';
import { Page } from 'types';

export interface GroupFilters {
  keyword?: string;
}

export interface GroupSecurity {
  name: string
}

export interface GroupSecurities {
  security: GroupSecurity
}

export interface GroupList {
  groupName: string,
  description: string,
  marginCallLevel: number,
  stopoutLevel: number,
  groupSecurities: GroupSecurities[]
}

export interface GroupsListData {
  tradingEngineAdminGroups: Pageable<GroupList>
}

export interface GroupsListVariables {
  args: {
    keyword?: string,
    page: Page,
  }
}

export interface GroupsQueryResult extends Query<GroupsListData, GroupsListVariables> { }
