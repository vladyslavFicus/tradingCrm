import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

type Props = {
  children: ApolloComponentFn,
}

const REQUEST = gql`mutation CreateGridConfig($type: GridConfig__Types__Enum!, $columns: [String]!) {
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
