import gql from 'graphql-tag';

export default gql`query ProfileContactsQuery (
    $playerUUID: String!
  ){
    profileContacts(playerUUID: $playerUUID) {
      additionalEmail
      additionalPhone
      email
      phone
    }
  }
`;
