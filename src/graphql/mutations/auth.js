import gql from 'graphql-tag';

const unlockLoginMutation = gql`mutation unlockLogin($playerUUID: String!) {
  auth {
    unlockLogin(playerUUID: $playerUUID) {
      data {
        success
      }
      error {
        error
      }
    }
  }
}`;

export {
  unlockLoginMutation,
};
