import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export interface Props {
  children: any;
}

const REQUEST = gql`
  query TradingEngineAdmin_TradingEngineSecuritiesQuery {
    tradingEngineSecurities {
      name
      symbols
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
