import { gql } from '@apollo/client';

export default gql`query ProfilePhonesQuery (
    $playerUUID: String!
  ){
    profileContacts(playerUUID: $playerUUID) {
      additionalPhone
      phone
    }
  }
`;
