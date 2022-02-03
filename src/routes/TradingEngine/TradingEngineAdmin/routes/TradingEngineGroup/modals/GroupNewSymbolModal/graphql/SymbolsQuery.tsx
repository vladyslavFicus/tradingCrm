import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';
import { GroupSecurity } from '../../../types';

export interface Props {
  children: ApolloComponentFn,
  groupSecurities: GroupSecurity[],
}

const REQUEST = gql`
  query TradingEngineAdmin_TradingEngineSymbolsQuery(
    $args: TradingEngineSymbols__Input
  ) {
    tradingEngineAdminSymbols(args: $args) {
      content {
        symbol
        securityId
        percentage
        swapConfigs {
          long
          short
        }
      }
    }
  }
`;

const SymbolsQuery = ({ children, groupSecurities }: Props) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    skip={groupSecurities.length === 0} // Skip request if no groupSecurities provided
    variables={{
      args: {
        // Get all symbols in certain securities selected in table above
        securityNames: groupSecurities.map(({ security }) => security.name),
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
