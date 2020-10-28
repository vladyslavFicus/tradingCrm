import gql from 'graphql-tag';

export default gql`query
  DistributionRules__ClientsAmount($uuid: String) {
    distributionClientsAmount(uuid: $uuid)
  }
`;
