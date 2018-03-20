
import gql from 'graphql-tag';

const notesQuery = gql`query profileData($playerUUID: String!){
  notes(playerUUID: $playerUUID) {
    content {
      content
    }
  }
}`;

export {
  notesQuery,
};

