import gql from 'graphql-tag';

export default gql`query TradingEngineAdmin_SymbolQuery($symbolName: String!) {
  tradingEngineAdminSymbol (symbolName: $symbolName) {
    symbolType
    digits
    quoteCurrency
    baseCurrency
    filtration {
      discardFiltrationLevel
      filterSmoothing
      hardFilter
      hardFiltrationLevel
      softFilter
      softFiltrationLevel
    }
    symbolSessions {
      dayOfWeek
      quote {
        openTime
        closeTime
      }
      trade {
        openTime
        closeTime
      }
    }
  }
}
`;
