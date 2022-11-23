import React from 'react';
import { Query } from '@apollo/client/react/components';
import { gql } from '@apollo/client';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

type Props = {
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
