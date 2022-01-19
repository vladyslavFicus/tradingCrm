import { Query, Page } from 'types';
import { Pageable } from 'types/query';

export interface IpWhitelistAddress {
  id: string,
  ip: string,
  createdAt: string,
  description?: string,
}

export interface IpWitelististSearchData {
  ipWhitelistSearch: Pageable<IpWhitelistAddress>
}

export interface IpWhitelistSearchArg {
  args: {
    search?: string,
    page: Page
  }
}

export interface WitelististSearchQueryResult extends Query<IpWitelististSearchData, IpWhitelistSearchArg> { }
