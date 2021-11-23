import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngine_TradingEngineSymbolsQuery {
    tradingEngineSymbols {
      content {
        name
      }
    }
  }
`;

const TradingEngineSymbolsQuery = ({ children }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

TradingEngineSymbolsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default TradingEngineSymbolsQuery;
