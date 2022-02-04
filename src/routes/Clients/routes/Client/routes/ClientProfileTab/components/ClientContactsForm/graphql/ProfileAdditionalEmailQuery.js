import { gql } from '@apollo/client';

export default gql`query ProfileAdditionalEmailQuery (
  $playerUUID: String!
){
  profileContacts(playerUUID: $playerUUID) {
    additionalEmail
  }
}
`;
