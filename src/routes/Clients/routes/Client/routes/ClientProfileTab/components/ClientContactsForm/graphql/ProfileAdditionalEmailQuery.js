import gql from 'graphql-tag';

export default gql`query ProfileAdditionalEmailQuery (
  $playerUUID: String!
){
  profileContacts(playerUUID: $playerUUID) {
    additionalEmail
  }
}
`;
