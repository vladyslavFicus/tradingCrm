import { gql } from '@apollo/client';

export default gql`query ProfileEmailQuery (
  $playerUUID: String!
){
  profileContacts(playerUUID: $playerUUID) {
    email
  }
}
`;
