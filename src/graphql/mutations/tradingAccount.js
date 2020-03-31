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
    ) {
      success
      error {
        error
        fields_errors
      }
    }
  }
}`;

const tradingAccountChangePasswordMutation = gql`mutation tradingAccountChangePassword(
  $profileUUID: String!
  $password: String!
  $accountUUID: String!
) {
  tradingAccount {
    changePassword(profileUUID: $profileUUID, password: $password, accountUUID: $accountUUID) {
      success
      error {
        error
        fields_errors
      }
    }
  }
}`;

export {
  createTradingAccountMutation,
  tradingAccountChangePasswordMutation,
};
