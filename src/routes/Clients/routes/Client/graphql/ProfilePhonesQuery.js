import gql from 'graphql-tag';

export default gql`query ProfilePhonesQuery (
    $playerUUID: String!
  ){
    profileContacts(playerUUID: $playerUUID) {
      additionalPhone
      phone
    }
  }
`;
