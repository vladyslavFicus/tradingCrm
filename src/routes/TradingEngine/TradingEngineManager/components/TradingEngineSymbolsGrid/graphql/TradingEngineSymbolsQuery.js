import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

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

const TradingEngineSymbolsQuery = ({ children }) => (
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

TradingEngineSymbolsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default TradingEngineSymbolsQuery;
