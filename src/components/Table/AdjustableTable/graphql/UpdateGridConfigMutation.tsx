
import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

interface Props {
  children: ApolloComponentFn,
}

const REQUEST = gql`mutation updateGridConfig($uuid: String!, $columns: [String]!) {
  gridConfig {
    update(columns: $columns, uuid: $uuid)
  }
}
`;

const UpdateGridConfigMutation = ({ children }: Props) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

export default UpdateGridConfigMutation;
