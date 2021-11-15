import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngine_TradingEngineSymbolsQuery($args: TradingEngineSymbolsSearch__Input) {
    tradingEngineSymbolsSearch(args: $args) {
      content {
        name
        digits
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
        ...state?.filters,
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
