import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`
  query TradingEngine_TradingEngineSymbolsSourcesQuery {
    tradingEngineAdminSymbolsSources
  }
`;

const SymbolsSourcesQuery = ({ children }: Props) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

SymbolsSourcesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default SymbolsSourcesQuery;
