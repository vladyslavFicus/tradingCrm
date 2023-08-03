export type FormValues = {
  executionType: string | null,
  sourceBrandConfig: {
    brand: string | null,
    affiliateUuids: string[] | null,
    desks: string[] | null,
    teams: string[] | null,
    salesStatuses: string[] | null,
    timeInCurrentStatusInHours: number | null,
    countries: string[] | null,
    languages: string[] | null,
    firstTimeDeposit: boolean | null,
    sortType: string | null,
    distributionUnit: {
      quantity: number | null,
      baseUnit: string | null,
    },
    registrationPeriodInHours: number | null,
    registrationDateRange: {
      from: string | null,
      to: string | null,
    },
    lastNotePeriodInHours: number | null,
    lastNoteDateRange: {
      from: string | null,
      to: string | null,
    },
  },
  targetBrandConfig: {
    brand: string | null,
    targetSalesStatus: string | null,
    affiliateUuid: string | null,
    operator: string | null,
    copyAffiliateSource: boolean | null,
    distributionUnit: {
      quantity: number | null,
      baseUnit: string | null,
    },
  },
};

export type Team = {
  name: string,
  uuid: string,
  parentBranch: {
    uuid: string,
  } | null,
};

export type RulesFormValues = {
  searchParam?: string,
  ruleStatus?: string,
  fromBrand?: string,
  toBrand?: string,
  salesStatuses?: Array<string>,
  affiliateUuids?: Array<string>,
  languages?: Array<string>,
  countries?: Array<string>,
  firstTimeDeposit?: boolean,
  createdDateFrom?: string,
  createdDateTo?: string,
  timesInCurrentStatusInHours?: Array<number>,
  lastTimeExecutedFrom?: string,
  lastTimeExecutedTo?: string,
};

export type Desk = {
  name: string,
  uuid: string,
};

export type Partner = {
  uuid: string,
  fullName: string | null,
  status: string,
};
