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

export {
  addWageringFulfillment,
};
