import gql from 'graphql-tag';

const activePlanQuery = gql`query activePlanQuery($playerUUID: String!){
  rewardPlan(playerUUID: $playerUUID) {
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
}`;

const pendingPayoutsQuery = gql`query pendingPayoutsQuery($playerUUID: String!){
  rewardPlan(playerUUID: $playerUUID) {
    data {
      userId
      runes {
        _id
        amount
        isActive
      }
      cashBacks {
        _id
        amount
        isActive
      }
      freeSpins {
        _id
        amount
        isActive
      }
      bonus {
        _id
        amount
        isActive
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
