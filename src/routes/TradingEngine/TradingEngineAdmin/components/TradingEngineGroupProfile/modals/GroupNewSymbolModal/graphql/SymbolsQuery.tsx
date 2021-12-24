import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn,
}

const REQUEST = gql`
  query TradingEngineAdmin_TradingEngineSymbolsQuery(
    $args: TradingEngineSymbols__Input
  ) {
    tradingEngineAdminSymbols(args: $args) {
      content {
        symbol
        percentage
        swapConfigs {
          long
          short
        }
      }
    }
  }
`;

const SymbolsQuery = ({ children }: Props) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{
      args: {
        page: {
          from: 0,
          size: 1000000,
        },
      },
    }}
  >
    {children}
  </Query>
);

export default SymbolsQuery;
