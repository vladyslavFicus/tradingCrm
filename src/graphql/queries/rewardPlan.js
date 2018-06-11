import gql from 'graphql-tag';

const activePlanQuery = gql`query activePlanQuery($playerUUID: String!){
  activeRewardPlan(playerUUID: $playerUUID) {
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

const pendingPayoutsQuery = gql`query pendingPayoutsQuery($playerUUID: String!){
  pendingRewardPlan(playerUUID: $playerUUID) {
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
