
import gql from 'graphql-tag';

const profileQuery = gql`query profileData($playerUUID: String!){
  playerProfile(playerUUID: $playerUUID) {
    data {
      playerUUID
      currency
    }
    error {
      error
    }
  }
}`;

export {
  profileQuery,
};

