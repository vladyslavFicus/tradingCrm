import gql from 'graphql-tag';

export default gql`query ProfileContactsQuery (
    $playerUUID: String!
  ){
    profileContacts(playerUUID: $playerUUID) {
      additionalPhone
      phone
    }
  }
`;
