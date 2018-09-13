import gql from 'graphql-tag';

const addWageringFulfillment = gql`mutation addWageringFulfillment(
  $amounts: [InputMoney]!
  ) {
  wageringFulfillment {
    add (
      amounts: $amounts,
    ) {
      data {
        uuid
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;
const addDepositFulfillment = gql`mutation addDepositFulfillment(
  $minAmount: [InputMoney]!,
  $maxAmount: [InputMoney],
  $numDeposit: Int,
  $excludedPaymentMethods: [String]
) {
  depositFulfillment {
    add (
      minAmount: $minAmount,
      maxAmount: $maxAmount,
      numDeposit: $numDeposit,
      excludedPaymentMethods: $excludedPaymentMethods
    ) {
      data {
        uuid
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const addGamingFulfillment = gql`mutation addGamingFulfillment(
  $brandId: String!
  $aggregationType: String!
  $moneyType: String!
  $spinType: String!
  $amount: [InputMoney]!
  $gameFilter: String!
  $gameList: [String]
) {
  gamingFulfillment {
    add (
      brandId: $brandId
      aggregationType: $aggregationType
      moneyType: $moneyType
      spinType: $spinType
      amount: $amount
      gameFilter: $gameFilter
      gameList: $gameList
    ) {
      data {
        uuid
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const updateGamingFulfillment = gql`mutation updateGamingFulfillment(
  $uuid: String!,
  $aggregationType: String!
  $moneyType: String!
  $spinType: String!
  $amount: [InputMoney]!
  $gameFilter: String!
  $gameList: [String]
) {
  gamingFulfillment {
    update (
      uuid: $uuid,
      aggregationType: $aggregationType
      moneyType: $moneyType
      spinType: $spinType
      amount: $amount
      gameFilter: $gameFilter
      gameList: $gameList
    ) {
      data {
        _id,
        uuid
      }
    }
  }
}`;

const updateDepositFulfillment = gql`mutation updateDepositFulfillment(
  $uuid: String!,
  $minAmount: [InputMoney]!,
  $maxAmount: [InputMoney],
  $numDeposit: Int,
  $excludedPaymentMethods: [String]
) {
  depositFulfillment {
    update (
      uuid: $uuid,
      minAmount: $minAmount,
      maxAmount: $maxAmount,
      numDeposit: $numDeposit,
      excludedPaymentMethods: $excludedPaymentMethods
    ) {
      data {
        _id,
        uuid
      }
    }
  }
}`;

export {
  addWageringFulfillment,
  addDepositFulfillment,
  updateDepositFulfillment,
  addGamingFulfillment,
  updateGamingFulfillment,
};
