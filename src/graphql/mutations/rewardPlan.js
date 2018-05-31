import gql from 'graphql-tag';

const lotteryMutation = gql`mutation updateLottery(
  $playerUUID: String!
  $amount: Float!
) {
  rewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
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

const bonusMutation = gql`mutation updateBonus(
  $playerUUID: String!
  $amount: Float!
) {
  rewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      type: "bonus"
      ) {
      data {
        userId
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
  }
}`;

const runesMutation = gql`mutation updateRunes(
  $playerUUID: String!
  $amount: Float!
) {
  rewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      type: "runes"
      ) {
      data {
        userId
        runes {
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

const freeSpinsMutation = gql`mutation updateFreeSpins(
  $playerUUID: String!
  $amount: Float!
) {
  rewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      type: "freeSpins"
      ) {
      data {
        userId
        freeSpins {
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

const cashBacksMutation = gql`mutation updateCashBacks(
  $playerUUID: String!
  $amount: Float!
) {
  rewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      type: "cashBacks"
      ) {
      data {
        userId
        cashBacks {
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
  bonusMutation,
  runesMutation,
  freeSpinsMutation,
  cashBacksMutation,
};
