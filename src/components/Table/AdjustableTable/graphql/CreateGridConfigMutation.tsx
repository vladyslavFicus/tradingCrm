
import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

interface Props {
  children: ApolloComponentFn,
}

const REQUEST = gql`mutation createGridConfig($type: GridConfig__Types__Enum!, $columns: [String]!) {
  gridConfig {
    create(columns: $columns, type: $type) {
      uuid
    }
  }
}
`;

const CreateGridConfigMutation = ({ children }: Props) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

export default CreateGridConfigMutation;
