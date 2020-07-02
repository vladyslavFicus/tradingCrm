import gql from 'graphql-tag';

export const updateTradingAccountMutation = gql`mutation updateTradingAccount(
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
      }
    }
  }
}`;
