import gql from 'graphql-tag';

const createTradingAccountMutation = gql`mutation createTradingAccount(
  $name: String!
  $mode: String!
  $currency: String!
  $password: String!
  $profileId: String!
) {
  tradingAccount {
    create(
      profileId: $profileId,
      name: $name,
      mode: $mode,
      currency: $currency,
      password: $password,
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
