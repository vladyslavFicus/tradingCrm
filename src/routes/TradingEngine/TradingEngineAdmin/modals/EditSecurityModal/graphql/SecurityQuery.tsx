import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Children } from 'types/children';

export interface Props {
  children: Children,
  name: string,
}

const REQUEST = gql`
  query TradingEngine_SecurityQuery($securityName: String!) {
    tradingEngineSecurity (
      securityName: $securityName
    ) {
      name
      description
    }
  }
`;

const SecurityQuery = ({ children, name }: Props) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ securityName: name }}
  >
    {children}
  </Query>
);

export default SecurityQuery;
