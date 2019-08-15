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
  $isReadOnly: Boolean
  $profileId: String!
  $login: Int!
) {
  tradingAccount {
    update(
      profileId: $profileId,
      login: $login,
      name: $name,
      mode: $mode,
      currency: $currency,
      isReadOnly: $isReadOnly,
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
  $login: Int!
  $password: String!
) {
  tradingAccount {
    changePassword(login: $login, password: $password) {
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
