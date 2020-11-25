import { gql } from '@apollo/client';

export default gql`query DistributionRuleClientsAmountQuery(
  $salesStatuses: [String]!
  $countries: [String]!
  $languages: [String]!
  $sourceBrand: String!
  $targetBrand: String
  $firstTimeDeposit: Boolean
  $registrationPeriodInHours: Int!
  $executionPeriodInHours: Int!
  $affiliateUuids: [String]
) {
  distributionRuleClientsAmount(
    salesStatuses: $salesStatuses
    countries: $countries
    languages: $languages
    sourceBrand: $sourceBrand
    targetBrand: $targetBrand
    firstTimeDeposit: $firstTimeDeposit
    registrationPeriodInHours: $registrationPeriodInHours
    executionPeriodInHours: $executionPeriodInHours
    affiliateUuids: $affiliateUuids
  )
}`;
