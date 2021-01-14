import gql from 'graphql-tag';

export default gql`query DistributionRuleClientsAmountQuery(
  $salesStatuses: [String]!
  $countries: [String]!
  $languages: [String]!
  $sourceBrand: String!
  $targetBrand: String
  $firstTimeDeposit: Boolean
  $registrationPeriodInHours: Int
  $registrationDateRange: DistributionRule__DateRange__Input
  $lastNotePeriodInHours: Int
  $lastNoteDateRange: DistributionRule__DateRange__Input
  $executionPeriodInHours: Int!
  $affiliateUuids: [String]
  $desks: [String]
  $teams: [String]
) {
  distributionRuleClientsAmount(
    salesStatuses: $salesStatuses
    countries: $countries
    languages: $languages
    sourceBrand: $sourceBrand
    targetBrand: $targetBrand
    firstTimeDeposit: $firstTimeDeposit
    registrationPeriodInHours: $registrationPeriodInHours
    registrationDateRange: $registrationDateRange
    lastNotePeriodInHours: $lastNotePeriodInHours
    lastNoteDateRange: $lastNoteDateRange
    executionPeriodInHours: $executionPeriodInHours
    affiliateUuids: $affiliateUuids
    desks: $desks
    teams: $teams
  )
}`;
