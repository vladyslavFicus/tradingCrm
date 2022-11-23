import { Query, Pageable, Sort } from 'types';

export interface IpWhitelistFeedFilters {
  filters?: {
    searchBy?: string,
    auditLogType?: string,
    creationDateFrom?: string,
    creationDateTo?: string,
  },
  sorst?: Sort[],
}

export interface Feed {
  authorFullName?: string,
  authorUuid: string,
  brandId: string,
  creationDate: string,
  details?: string,
  id: string,
  ip?: string,
  targetFullName?: string,
  targetUuid: string,
  type: string,
  uuid: string,
}

export interface IpWhitelistFeedsData {
  feeds: Pageable<Feed>,
}

export interface IpWhitelistFeedsSearchArg {
  searchBy?: string,
  auditLogType?: string,
  creationDateFrom?: string,
  creationDateTo?: string,
  page: number,
}

export interface WhitelistFeedsQueryResult extends Query<IpWhitelistFeedsData, IpWhitelistFeedsSearchArg> { }
