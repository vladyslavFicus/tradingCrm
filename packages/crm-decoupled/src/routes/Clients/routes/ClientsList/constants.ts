export const storageKey = 'clientsGridFilterFields';

export const MAX_SELECTED_CLIENTS = 5000;
export const MAX_QUERY_CLIENTS = 10000;

export const attributeLabels = {
  activityStatus: 'PROFILE.LIST.FILTERS.ACTIVITY',
  affiliateFtd: 'PROFILE.LIST.FILTERS.AFFILIATE_FTD',
  offices: 'PROFILE.LIST.FILTERS.OFFICES',
  affiliateFtdDateRange: 'PROFILE.LIST.FILTERS.AFFILIATE_FTD_DATE_RANGE',
  acquisitionStatus: 'PROFILE.LIST.FILTERS.ACQUISITION_STATUS',
  affiliateUuids: 'PROFILE.LIST.FILTERS.AFFILIATES',
  affiliateReferrals: 'PROFILE.LIST.FILTERS.AFFILIATES_REFERRALS',
  assignStatus: 'PROFILE.LIST.FILTERS.ASSIGN_STATUS',
  balance: 'PROFILE.LIST.FILTERS.BALANCE',
  deposit: 'PROFILE.LIST.FILTERS.DEPOSIT',
  countries: 'PROFILE.LIST.FILTERS.COUNTRY',
  passportCountryOfIssue: 'PROFILE.LIST.FILTERS.PASSPORT_ISSUE_COUNTRY',
  desks: 'PROFILE.LIST.FILTERS.DESKS',
  firstDepositDateRange: 'PROFILE.LIST.FILTERS.FIRST_DEPOSIT_DATE',
  firstNoteDateRange: 'PROFILE.LIST.FILTERS.FIRST_NOTE_DATE',
  firstTimeDeposit: 'PROFILE.LIST.FILTERS.FIRST_DEPOSIT',
  isReferrered: 'PROFILE.LIST.FILTERS.REFERRAL',
  kycStatuses: 'PROFILE.LIST.FILTERS.KYC_STATUSES',
  languages: 'PROFILE.LIST.FILTERS.LANGUAGES',
  lastNoteDateRange: 'PROFILE.LIST.FILTERS.LAST_NOTE_DATE',
  lastTradeDateRange: 'PROFILE.LIST.FILTERS.LAST_TRADE_DATE',
  lastLoginDateRange: 'PROFILE.LIST.FILTERS.LAST_LOGIN_DATE',
  lastModificationDateRange: 'PROFILE.LIST.FILTERS.LAST_MODIFICATION_DATE',
  lastCallDateRange: 'PROFILE.LIST.FILTERS.LAST_CALL_DATE',
  isNeverCalled: 'PROFILE.LIST.FILTERS.NEVER_CALLED',
  migrationId: 'PROFILE.LIST.FILTERS.SEARCH',
  operators: 'PROFILE.LIST.FILTERS.OPERATORS',
  salesOperators: 'PROFILE.LIST.FILTERS.SALES_OPERATORS',
  retentionOperators: 'PROFILE.LIST.FILTERS.RETENTION_OPERATORS',
  registrationDate: 'PROFILE.LIST.FILTERS.REG_DATE_RANGE',
  retentionStatuses: 'PROFILE.LIST.FILTERS.RETENTION_STATUS',
  salesStatuses: 'PROFILE.LIST.FILTERS.SALES_STATUS',
  searchByAffiliateIdentifiers: 'PROFILE.LIST.FILTERS.SEARCH',
  searchByIdentifiers: 'PROFILE.LIST.FILTERS.SEARCH',
  searchLimit: 'COMMON.FILTERS.SEARCH_LIMIT',
  statuses: 'PROFILE.LIST.FILTERS.STATUS',
  teams: 'PROFILE.LIST.FILTERS.TEAMS',
  termsAccepted: 'PROFILE.LIST.FILTERS.TERM_ACCEPTED',
  warnings: 'PROFILE.LIST.FILTERS.WARNING',
  timeZone: 'COMMON.TIME_ZONE',
};

export const activityStatuses = [
  {
    value: 'ONLINE',
    label: 'PROFILE.LAST_ACTIVITY.STATUS.ONLINE',
  },
  {
    value: 'OFFLINE',
    label: 'PROFILE.LAST_ACTIVITY.STATUS.OFFLINE',
  },
];

export const radioSelect = [
  {
    value: false,
    label: 'COMMON.NO',
  },
  {
    value: true,
    label: 'COMMON.YES',
  },
];

export const acquisitionStatuses = [
  {
    value: 'RETENTION',
    label: 'COMMON.RETENTION',
  },
  {
    value: 'SALES',
    label: 'COMMON.SALES',
  },
];

export const assignStatuses = [
  {
    value: 'ASSIGNED',
    label: 'COMMON.ASSIGN',
  },
  {
    value: 'UNASSIGNED',
    label: 'COMMON.UN_ASSIGN',
  },
];

export const defaultColumns = [
  'firstName', 'warning', 'lastActivityDate', 'addressCountryCode', 'balance', 'depositsCount', 'affiliateReferrer',
  'sales', 'retention', 'registrationDate', 'lastNoteChangedAt', 'lastCallDate', 'status',
];

export const OPERATORS_SORT = [
  { column: 'operatorStatus', direction: 'ASC' },
  { column: 'firstName', direction: 'ASC' },
  { column: 'lastName', direction: 'ASC' },
];

export const PARTNERS_SORT = [
  { column: 'status', direction: 'ASC' },
  { column: 'firstName', direction: 'ASC' },
  { column: 'lastName', direction: 'ASC' },
];

export const oldFilters = [
  'searchByIdentifiers',
  'searchByAffiliateIdentifiers',
  'migrationId',
  'activityStatus',
  'affiliateFtd',
  'affiliateFtdDateRange',
  'languages',
  'countries',
  'desks',
  'teams',
  'operators',
  'affiliateUuids',
  'salesOperators',
  'retentionOperators',
  'isReferrered',
  'statuses',
  'acquisitionStatus',
  'passportCountriesOfIssue',
  'salesStatuses',
  'retentionStatuses',
  'assignStatus',
  'kycStatuses',
  'firstTimeDeposit',
  'warnings',
  'balanceRange',
  'depositsCountRange',
  'registrationDateRange',
  'firstDepositDateRange',
  'firstNoteDateRange',
  'lastNoteDateRange',
  'lastTradeDateRange',
  'lastLoginDateRange',
  'lastModificationDateRange',
  'lastCallDateRange',
  'isNeverCalled',
  'searchLimit',
  'offices',
  'timeZone',
  'termsAccepted',
];

export const defaultFilters = [
  'searchByIdentifiers',
  'activityStatus',
  'registrationDateRange',
  'searchLimit',
];
