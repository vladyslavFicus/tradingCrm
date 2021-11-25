import gql from 'graphql-tag';

export default gql`query ProfileEmailQuery (
  $playerUUID: String!
){
  profileContacts(playerUUID: $playerUUID) {
    email
  }
}
`;
