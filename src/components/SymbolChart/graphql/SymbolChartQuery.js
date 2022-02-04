import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query TradingEngine_SymbolChartQuery(
    $symbol: String!
    $size: Int!
  ) {
    tradingEngineSymbolPrices (
      symbol: $symbol
      size: $size
    ) {
      name
      ask
      bid
      time
    }
  }
`;

const SymbolChartQuery = ({ children, symbol, size }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ symbol, size }}
    skip={!symbol}
  >
    {children}
  </Query>
);

SymbolChartQuery.propTypes = {
  children: PropTypes.func.isRequired,
  symbol: PropTypes.string,
  size: PropTypes.number,
};

SymbolChartQuery.defaultProps = {
  size: 2000,
  symbol: null,
};

export default SymbolChartQuery;
