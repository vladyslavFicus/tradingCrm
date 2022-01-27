import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

interface Props {
  children: ApolloComponentFn,
  type: string,
}
const REQUEST = gql`query GridConfig($type: GridConfig__Types__Enum) {
    gridConfig(type: $type) {
      uuid
      columns
    }
  }
`;

const GridConfigQuery = ({ children, type }: Props) => (
  <Query
    query={REQUEST}
    variables={{ type }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

export default GridConfigQuery;
