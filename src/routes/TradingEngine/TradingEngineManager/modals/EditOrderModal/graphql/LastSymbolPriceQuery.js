import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
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

const LastSymbolPriceQuery = ({ children, order, size }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ symbol: order.symbol, size }}
    skip={!order.symbol}
  >
    {children}
  </Query>
);

LastSymbolPriceQuery.propTypes = {
  children: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  size: PropTypes.number,
};

LastSymbolPriceQuery.defaultProps = {
  size: 1,
};

export default LastSymbolPriceQuery;
