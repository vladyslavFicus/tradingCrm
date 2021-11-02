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
    enable
    profileUuid
    profileFullName
    registrationDate
    leverage
    balance
    accountType
    allowedSymbols {
      name
      description
      digits
      lotSize
      groupSpread(identifier: $identifier) {
        bidAdjustment
        askAdjustment
      }
    }
  }
}
`;
