import { gql } from '@apollo/client';

export default gql`query
  DistributionRules__ClientsAmount($uuid: String) {
    distributionClientsAmount(uuid: $uuid)
  }
`;
