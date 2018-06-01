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

const bonusMutation = gql`mutation updateBonus(
  $playerUUID: String!
  $amount: Float!
  $isActive: Boolean!
) {
  rewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      isActive: $isActive
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
  $isActive: Boolean!
) {
  rewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      isActive: $isActive
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
  $isActive: Boolean!
) {
  rewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      isActive: $isActive
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
  $isActive: Boolean!
) {
  rewardPlan {
    update(
      playerUUID: $playerUUID
      amount: $amount
      isActive: $isActive
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
