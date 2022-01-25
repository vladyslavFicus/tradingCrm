import gql from 'graphql-tag';

export default gql`query TradingEngine_AccountQuery($identifier: String!) {
  tradingEngineAccount (
    identifier: $identifier
  ) {
    uuid
    name
    login
    group
    currency
    credit
    balance
    accountType
  }
}
`;
