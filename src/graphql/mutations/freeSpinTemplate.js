import gql from 'graphql-tag';

const claimFreeSpinMutation = gql`mutation claimFreeSpinTemplate(
  $freeSpinUUID: String!
  $templateUUID: String!
  $playerUUID: String!
  $currency: String!
) {
  freeSpinTemplate {
    claim(
      freeSpinUUID: $freeSpinUUID
      templateUUID: $templateUUID
      playerUUID: $playerUUID
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
