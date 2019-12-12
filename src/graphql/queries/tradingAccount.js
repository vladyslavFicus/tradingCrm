import gql from 'graphql-tag';

const getTradingAccount = gql`query getTradingAccount($uuid: String!, $accountType: String) {
    tradingAccount(uuid: $uuid, accountType: $accountType) {
      accountUUID
      currency
      balance
      credit
      margin
      name
      login
      group
      accountType
      archived
      leverage
      readOnlyUpdateTime
      readOnlyUpdatedBy
      readOnly
      profileUUID
      operator {
        fullName
      }
    }
  }`;

export {
  getTradingAccount,
};
