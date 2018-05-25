import gql from 'graphql-tag';

const declineFreeSpinMutation = gql`mutation declineFreeSpin(
  $playerUUID: String!,
  $uuid: String!,
) {
  freeSpin {
    decline(
      playerUUID: $playerUUID,
      uuid: $uuid
      ) {
      data {
        _id,
        status
      }
      error {
        error
      }
    }
  }
}`;

export {
  declineFreeSpinMutation,
};
