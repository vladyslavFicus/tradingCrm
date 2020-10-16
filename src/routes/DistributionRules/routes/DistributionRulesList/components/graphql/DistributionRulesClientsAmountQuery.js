import gql from 'graphql-tag';

export default gql`query
  DistributionRules__ClientsAmount($uuid: String) {
    clientsAmount(uuid: $uuid)
  }
`;
