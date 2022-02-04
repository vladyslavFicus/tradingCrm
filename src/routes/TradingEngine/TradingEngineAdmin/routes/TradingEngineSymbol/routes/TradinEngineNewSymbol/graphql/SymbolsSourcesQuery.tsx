import React from 'react';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import { gql } from '@apollo/client';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`
  query TradingEngine_TradingEngineSymbolsSourcesQuery {
    tradingEngineAdminSymbolsSources {
      sourceName
    }
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
