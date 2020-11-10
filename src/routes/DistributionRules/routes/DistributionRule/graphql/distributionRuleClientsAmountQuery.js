import gql from 'graphql-tag';

export default gql`query DistributionRuleClientsAmountQuery(
  $salesStatuses: [String]!
  $countries: [String]!
  $languages: [String]!
  $sourceBrand: String!
  $targetBrand: String
  $registrationPeriodInHours: Int!
  $executionPeriodInHours: Int!
) {
  distributionRuleClientsAmount(
    salesStatuses: $salesStatuses
    countries: $countries
    languages: $languages
    sourceBrand: $sourceBrand
    targetBrand: $targetBrand
    registrationPeriodInHours: $registrationPeriodInHours
    executionPeriodInHours: $executionPeriodInHours
  )
}`;
