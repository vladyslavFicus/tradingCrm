import gql from 'graphql-tag';

const addWageringFulfillment = gql`mutation addWageringFulfillment(
  $brandId: String!,
  $uuid: String!
  $amounts: [InputMoney]!
  ) {
  wageringFulfillment {
    add (
      brandId: $brandId,
      uuid: $uuid,
      amounts: $amounts,
    ) {
      data {
        aggregatorId
        providerId
        name
        status
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
