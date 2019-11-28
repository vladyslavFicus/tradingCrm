import gql from 'graphql-tag';

const tradingAccountOptions = gql`
  query tradingAccountOptions {
    options {
      tradingAccount {
        mt4 {
          currencies
        }
      }
    }
  }`;

const getTradingAccount = gql`query getTradingAccount($uuid: String!, $accountType: String) {
    tradingAccount(uuid: $uuid, accountType: $accountType) {
      currency
      balance
      credit
      margin
      name
      login
      group
      accountType
      archived
    }
  }`;

export {
  tradingAccountOptions,
  getTradingAccount,
};
