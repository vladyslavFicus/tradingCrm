import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query TradingEngineAdmin_TradingEngineSymbolsQuery(
    $args: TradingEngineSymbols__Input
  ) {
    tradingEngineAdminSymbols(args: $args) {
      content {
        symbol
        securityName
        askSpread
        bidSpread
        stopsLevel
        digits
        swapConfigs {
          long
          short
        }
      }
      page
      number
      totalElements
      size
      last
    }
  }
`;

const TradingEngineSymbolsQuery = ({ children, location: { state } }) => (
  <Query
    query={REQUEST}
    variables={{
      args: {
        ...state && state.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
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
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
      sorts: PropTypes.array,
    }),
  }).isRequired,
};

export default TradingEngineSymbolsQuery;
