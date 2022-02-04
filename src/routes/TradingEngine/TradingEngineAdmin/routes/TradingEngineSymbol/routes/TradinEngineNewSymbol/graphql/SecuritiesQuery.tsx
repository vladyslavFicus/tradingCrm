import React from 'react';
import { Query } from '@apollo/client/react/components';
import { gql } from '@apollo/client';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`
  query TradingEngineAdmin_TradingEngineSecuritiesQuery {
    tradingEngineSecurities {
      name
    }
  }
`;

const TradingEngineSecuritiesQuery = ({ children }: Props) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

export default TradingEngineSecuritiesQuery;
