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
}
