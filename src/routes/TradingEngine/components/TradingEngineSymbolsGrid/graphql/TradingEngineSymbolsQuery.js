import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngine_TradingEngineSymbolsQuery {
    tradingEngineSymbols {
      content {
        symbol
        bid
        ask
      }
    }
  }
`;

const TradingEngineSymbolsQuery = ({ children, location: { state } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...state?.filters,
      limit: 20,
      sorts: state?.sorts?.length ? state.sorts : undefined,
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

TradingEngineSymbolsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
      sorts: PropTypes.array,
    }),
  }).isRequired,
};

export default TradingEngineSymbolsQuery;
