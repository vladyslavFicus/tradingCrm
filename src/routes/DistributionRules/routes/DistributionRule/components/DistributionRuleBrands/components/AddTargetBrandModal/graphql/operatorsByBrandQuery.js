import { gql } from '@apollo/client';

export default gql`query DistributionRule_OperatorsByBrandQuery(
  $brandId: String!
  $hierarchyTypeGroup: Desk__Types__Enum!
) {
  operatorsByBrand(
    brandId: $brandId
    hierarchyTypeGroup: $hierarchyTypeGroup
  ) {
    uuid
    fullName
  }
}
`;
