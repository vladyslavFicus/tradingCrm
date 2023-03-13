export const attributeLabels = {
  searchKeyword: 'LEADS.FILTER.SEARCH',
  languages: 'LEADS.FILTER.LANGUAGES',
  countries: 'LEADS.FILTER.COUNTRIES',
  desks: 'LEADS.FILTER.DESKS',
  teams: 'LEADS.FILTER.TEAMS',
  salesAgents: 'LEADS.FILTER.SALES_AGENTS',
  salesStatuses: 'LEADS.FILTER.SALES_STATUS',
  status: 'LEADS.FILTER.ACCOUNT_STATUS',
  registrationDateRange: 'LEADS.FILTER.REGISTRATION_DATE_RANGE',
  lastNoteDateRange: 'LEADS.FILTER.LAST_NOTE_DATE_RANGE',
  searchLimit: 'COMMON.FILTERS.SEARCH_LIMIT',
  lastCallDateRange: 'LEADS.FILTER.LAST_CALL_DATE_RANGE',
  isNeverCalled: 'LEADS.FILTER.NEVER_CALLED',
  affiliate: 'LEADS.FILTER.AFFILIATE',
};

export const maxSearchLimit = 5000;

export const OPERATORS_SORT = [
  { column: 'operatorStatus', direction: 'ASC' },
  { column: 'firstName', direction: 'ASC' },
  { column: 'lastName', direction: 'ASC' },
];
