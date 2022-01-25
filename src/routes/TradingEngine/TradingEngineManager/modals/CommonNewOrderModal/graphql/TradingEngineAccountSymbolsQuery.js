import gql from 'graphql-tag';

export default gql`
  query TradingEngine_AccountSymbolsQuery($accountUuid: String!) {
    tradingEngineAccountSymbols (
      accountUuid: $accountUuid
    ) {
      name
      description
      digits
      config(accountUuid: $accountUuid) {
        lotSize
        bidAdjustment
        askAdjustment
      }
    }
  }
`;
