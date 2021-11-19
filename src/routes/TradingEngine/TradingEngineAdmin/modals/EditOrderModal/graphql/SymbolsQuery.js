import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngine_TradingEngineSymbolsQuery {
    tradingEngineSymbols {
      content {
        name
        bid
        ask
      }
    }
  }
`;

const SymbolsQuery = ({ children }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

SymbolsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default SymbolsQuery;
