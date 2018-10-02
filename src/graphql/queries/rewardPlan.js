import gql from 'graphql-tag';

const activePlanQuery = gql`query activePlanQuery(
  $playerUUID: String!
  $brandId: String!
){
  activeRewardPlan(
    playerUUID: $playerUUID
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
}`;

const pendingPayoutsQuery = gql`query pendingPayoutsQuery(
  $playerUUID: String!
  $brandId: String!
){
  pendingRewardPlan(
    playerUUID: $playerUUID
    brandId: $brandId
  ) {
    data {
      plans {
        _id
        amount
        type
      }
    } 
    error {
      error
    }
  }
}`;

export {
  activePlanQuery,
  pendingPayoutsQuery,
};
