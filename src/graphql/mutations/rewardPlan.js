import gql from 'graphql-tag';

const activePlanMutation = gql`mutation updateActivePlan(
  $playerUUID: String!
  $amount: Float!
  $type: String!
  $brandId: String!
  $isActive: Boolean!
) {
  activeRewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      type: $type
      isActive: $isActive
      brandId: $brandId
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
  $brandId: String!
  $isActive: Boolean!
) {
  pendingRewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      type: $type
      isActive: $isActive
      brandId: $brandId
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
