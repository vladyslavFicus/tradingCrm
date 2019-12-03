import gql from 'graphql-tag';

const createTradingAccountMutation = gql`mutation createTradingAccount(
  $name: String!
  $currency: String!
  $password: String!
  $profileId: String!
  $accountType: String
  $amount: Float
) {
  tradingAccount {
    create(
      profileId: $profileId,
      name: $name,
      currency: $currency,
      password: $password,
      accountType: $accountType,
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
  updateTradingAccountMutation,
  tradingAccountChangePasswordMutation,
};
