import gql from 'graphql-tag';

export default gql`query DistributionRuleClientsAmountQuery(
  $salesStatuses: [String]!
  $countries: [String]!
  $sourceBrand: String!
  $targetBrand: String
  $registrationPeriodInHours: Int!
  $executionPeriodInHours: Int!
) {
  distributionRuleClientsAmount(
    salesStatuses: $salesStatuses
    countries: $countries
    sourceBrand: $sourceBrand
    targetBrand: $targetBrand
    registrationPeriodInHours: $registrationPeriodInHours
    executionPeriodInHours: $executionPeriodInHours
  )
}`;
