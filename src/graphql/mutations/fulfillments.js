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
  $maxAmount: [InputMoney]!,
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

export {
  addWageringFulfillment,
  addDepositFulfillment,
};
