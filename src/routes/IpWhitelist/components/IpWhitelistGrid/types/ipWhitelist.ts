import { Query, Pageable, Page } from 'types';

export interface IpWitelistAddress {
  id: string,
  ip: string,
  createdAt: string,
  description?: string,
}

export interface IpWitelististSearchData {
  ipWhitelistSearch: Pageable<IpWitelistAddress>
}

export interface IpWhitelistSearchArg {
  args: {
    search?: string,
    page: Page
  }
}

export interface WitelististSearchQueryResult extends Query<IpWitelististSearchData, IpWhitelistSearchArg> { }
