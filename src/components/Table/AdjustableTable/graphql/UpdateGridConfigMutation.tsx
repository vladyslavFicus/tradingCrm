import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

interface Props {
  children: ApolloComponentFn,
}

const REQUEST = gql`mutation UpdateGridConfig($uuid: String!, $columns: [String]!) {
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
