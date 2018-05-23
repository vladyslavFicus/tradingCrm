import gql from 'graphql-tag';

const claimFreeSpinMutation = gql`mutation claimFreeSpinTemplate(
  $uuid: String!
  $playerUUID: String!
  $freeSpinUUID: String!
  $currency: String!
) {
  freeSpinTemplate {
    claim(
      playerUUID: $playerUUID
      uuid: $uuid
      freeSpinUUID: $freeSpinUUID
      currency: $currency
      ) {
      data {
        playerUUID
        freeSpinUUID
      }
      error {
        error
      }
    }
  }
}`;

export {
  claimFreeSpinMutation,
};
