import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`
  query TradingEngineAdmin_TradingEngineSecuritiesQuery {
    tradingEngineSecurities {
      id
      name
      description
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
