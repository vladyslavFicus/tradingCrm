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

export {
  tradingAccountOptions,
};
