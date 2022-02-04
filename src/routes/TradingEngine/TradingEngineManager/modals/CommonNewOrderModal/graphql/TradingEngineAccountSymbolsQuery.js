import { gql } from '@apollo/client';

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
        lotMin
        lotStep
        lotMax
        bidAdjustment
        askAdjustment
      }
    }
  }
`;
