import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query TradingEngine_TradingEngineSymbolsQuery(
    $args: TradingEngineSymbols__Input
  ) {
    tradingEngineSymbols(args: $args) {
      content {
        name
      }
    }
  }
`;

const SymbolsQuery = ({ children }) => (
  <Query
    query={REQUEST}
    variables={{
      args: {
        page: {
          from: 0,
          size: 1000000,
        },
      },
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

SymbolsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default SymbolsQuery;
