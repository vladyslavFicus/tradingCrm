import gql from 'graphql-tag';

export default gql`
  query TradingEngine_LastSymbolPriceQuery(
    $symbol: String!
    $size: Int!
  ) {
    tradingEngineSymbolPrices (
      symbol: $symbol
      size: $size
    ) {
      bid
    }
  }
`;
