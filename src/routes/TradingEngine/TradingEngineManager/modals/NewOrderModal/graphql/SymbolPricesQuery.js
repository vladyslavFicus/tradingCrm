import gql from 'graphql-tag';

export default gql`
  query TradingEngine_SymbolPricesQuery(
    $symbol: String!
    $size: Int!
  ) {
    tradingEngineSymbolPrices (
      symbol: $symbol
      size: $size
    ) {
      ask
      bid
    }
  }
`;
