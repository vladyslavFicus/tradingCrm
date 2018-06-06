import gql from 'graphql-tag';

const lotteryMutation = gql`mutation updateLottery(
  $playerUUID: String!
  $amount: Float!
  $isActive: Boolean!
) {
  rewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      isActive: $isActive
      type: "lottery"
      ) {
      data {
        userId
        lottery {
          _id
          amount
          isActive
        }
      }
      error {
        error
      }
    }
  }
}`;

const pendingPayoutsMutation = gql`mutation updatePendingPayout(
  $playerUUID: String!
  $amount: Float!
  $isActive: Boolean!
  $type: String!
  $bonus: Boolean!
  $runes: Boolean!
  $cashBacks: Boolean!
  $freeSpins: Boolean!
) {
  rewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      isActive: $isActive
      type: $type
      ) {
      data {
        userId
        bonus @include(if: $bonus) {
          _id
          amount
          isActive
        }
        runes @include(if: $runes) {
          _id
          amount
          isActive
        }
        cashBacks @include(if: $cashBacks) {
          _id
          amount
          isActive
        }
        freeSpins @include(if: $freeSpins) {
          _id
          amount
          isActive
        }
      }
      error {
        error
      }
    }
  }
}`;

export {
  lotteryMutation,
  pendingPayoutsMutation,
};
