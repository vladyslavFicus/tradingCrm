import { Query, Page, Sort, Pageable } from 'types';

export interface IpWhitelistFilters {
  filters?: {
    ip?: string
  };
  sorst?: Sort[],
}

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
