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
    }
  }
}`;

const tradingAccountChangePasswordMutation = gql`mutation tradingAccountChangePassword(
  $login: String!
  $password: String!
) {
  tradingAccount {
    changePassword(login: $login, password: $password) {
      success
    }
  }
}`;

export {
  createTradingAccountMutation,
  tradingAccountChangePasswordMutation,
};
