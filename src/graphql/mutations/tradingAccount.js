import gql from 'graphql-tag';

const createTradingAccountMutation = gql`mutation createTradingAccount(
  $name: String!
  $currency: String!
  $password: String!
  $profileId: String!
  $accountType: String!
  $platformType: String!
  $amount: Float
) {
  tradingAccount {
    create(
      profileId: $profileId,
      name: $name,
      currency: $currency,
      password: $password,
      accountType: $accountType,
      platformType: $platformType,
      amount: $amount,
    )
  }
}`;

const updateTradingAccountMutation = gql`mutation updateTradingAccount(
  $name: String
  $mode: String
  $currency: String
  $readOnly: Boolean
  $profileId: String!
  $accountUUID: String!
) {
  tradingAccount {
    update(
      profileId: $profileId,
      accountUUID: $accountUUID,
      name: $name,
      mode: $mode,
      currency: $currency,
      readOnly: $readOnly,
    )
  }
}`;

export {
  createTradingAccountMutation,
  updateTradingAccountMutation,
};
