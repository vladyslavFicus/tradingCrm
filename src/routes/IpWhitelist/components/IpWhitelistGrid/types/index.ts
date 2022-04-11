import { Query, Page, Sort, Pageable } from 'types';

export interface IpWhitelistFilters {
  filters?: {
    ip?: string
  };
  sorst?: Sort[],
}

export interface IpWhitelistAddress {
  uuid: string,
  ip: string,
  createdAt: string,
  description?: string,
}

export interface IpWhitelistSearchData {
  ipWhitelistSearch: Pageable<IpWhitelistAddress>
}

export interface IpWhitelistSearchArg {
  args: {
    ip?: string,
    page: Page
  }
}

export interface IpWhitelistSearchQueryResult extends Query<IpWhitelistSearchData, IpWhitelistSearchArg> { }
