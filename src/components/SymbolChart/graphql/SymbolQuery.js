import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngine_SymbolQuery($symbol: String!, $identifier: String) {
    tradingEngineSymbol(symbol: $symbol) {
      digits
      groupSpread(identifier: $identifier) {
        bidAdjustment
        askAdjustment
      }
    }
  }
`;

const SymbolQuery = ({ children, symbol, accountUuid }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ symbol, identifier: accountUuid }}
    skip={!symbol || !accountUuid}
  >
    {children}
  </Query>
);

SymbolQuery.propTypes = {
  children: PropTypes.func.isRequired,
  symbol: PropTypes.string,
  accountUuid: PropTypes.string,
};

SymbolQuery.defaultProps = {
  symbol: null,
  accountUuid: null,
};

export default SymbolQuery;