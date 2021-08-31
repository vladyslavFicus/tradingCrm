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

const LastSymbolPriceQuery = ({ children, order }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ symbol: order.symbol, size: 1 }}
    skip={!order.symbol}
  >
    {children}
  </Query>
);

LastSymbolPriceQuery.propTypes = {
  children: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
};

export default LastSymbolPriceQuery;
