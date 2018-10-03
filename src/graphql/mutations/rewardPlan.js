import gql from 'graphql-tag';

const activePlanMutation = gql`mutation updateActivePlan(
  $playerUUID: String!
  $amount: Float!
  $type: String!
) {
  activeRewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      type: $type
      ) {
      data {
        _id
        type
        amount
      }
      error {
        error
      }
    }
  }
}`;

const pendingPlanMutation = gql`mutation updatePendingPlan(
  $playerUUID: String!
  $amount: Float!
  $type: String!
) {
  pendingRewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      type: $type
      ) {
      data {
        _id
        amount
        type
      }
      error {
        error
      }
    }
  }
}`;

export {
  activePlanMutation,
  pendingPlanMutation,
};
