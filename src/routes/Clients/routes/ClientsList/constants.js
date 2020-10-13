const MAX_SELECTED_CLIENTS = 5000;

const attributeLabels = {
  activityStatus: 'PROFILE.LIST.FILTERS.ACTIVITY',
  acquisitionStatus: 'PROFILE.LIST.FILTERS.ACQUISITION_STATUS',
  affiliateUuids: 'PROFILE.LIST.FILTERS.AFFILIATES',
  assignStatus: 'PROFILE.LIST.FILTERS.ASSIGN_STATUS',
  balance: 'PROFILE.LIST.FILTERS.BALANCE',
  countries: 'PROFILE.LIST.FILTERS.COUNTRY',
  desks: 'PROFILE.LIST.FILTERS.DESKS',
  firstDepositDateRange: 'PROFILE.LIST.FILTERS.FIRST_DEPOSIT_DATE',
  firstNoteDateRange: 'PROFILE.LIST.FILTERS.FIRST_NOTE_DATE',
  firstTimeDeposit: 'PROFILE.LIST.FILTERS.FIRST_DEPOSIT',
  isReferrered: 'PROFILE.LIST.FILTERS.REFERRAL',
  kycStatuses: 'PROFILE.LIST.FILTERS.KYC_STATUSES',
  lastNoteDateRange: 'PROFILE.LIST.FILTERS.LAST_NOTE_DATE',
  lastTradeDateRange: 'PROFILE.LIST.FILTERS.LAST_TRADE_DATE',
  lastLoginDateRange: 'PROFILE.LIST.FILTERS.LAST_LOGIN_DATE',
  lastModificationDateRange: 'PROFILE.LIST.FILTERS.LAST_MODIFICATION_DATE',
  migrationId: 'PROFILE.LIST.FILTERS.SEARCH',
  operators: 'PROFILE.LIST.FILTERS.OPERATORS',
  registrationDate: 'PROFILE.LIST.FILTERS.REG_DATE_RANGE',
  retentionStatuses: 'PROFILE.LIST.FILTERS.RETENTION_STATUS',
  salesStatuses: 'PROFILE.LIST.FILTERS.SALES_STATUS',
  searchByAffiliateIdentifiers: 'PROFILE.LIST.FILTERS.SEARCH',
  searchByIdentifiers: 'PROFILE.LIST.FILTERS.SEARCH',
  searchLimit: 'COMMON.FILTERS.SEARCH_LIMIT',
  statuses: 'PROFILE.LIST.FILTERS.STATUS',
  teams: 'PROFILE.LIST.FILTERS.TEAMS',
  warnings: 'PROFILE.LIST.FILTERS.WARNING',
};

const activityStatuses = [
  {
    value: 'ONLINE',
    label: 'PROFILE.LAST_ACTIVITY.STATUS.ONLINE',
  },
  {
    value: 'OFFLINE',
    label: 'PROFILE.LAST_ACTIVITY.STATUS.OFFLINE',
  },
];

const radioSelect = [
  {
    value: false,
    label: 'COMMON.NO',
  },
  {
    value: true,
    label: 'COMMON.YES',
  },
];

const acquisitionStatuses = [
  {
    value: 'RETENTION',
    label: 'COMMON.RETENTION',
  },
  {
    value: 'SALES',
    label: 'COMMON.SALES',
  },
];

const assignStatuses = [
  {
    value: 'ASSIGNED',
    label: 'COMMON.ASSIGN',
  },
  {
    value: 'UNASSIGNED',
    label: 'COMMON.UN_ASSIGN',
  },
];

export {
  MAX_SELECTED_CLIENTS,
  acquisitionStatuses,
  activityStatuses,
  attributeLabels,
  assignStatuses,
  radioSelect,
};
