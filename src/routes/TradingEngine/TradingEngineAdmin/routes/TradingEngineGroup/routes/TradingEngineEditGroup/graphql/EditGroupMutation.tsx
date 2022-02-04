import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`mutation TradingEngine_EditGroupMutation(
  $args: TradingEngineEditGroupAdmin__Input
  ) {
  tradingEngineAdmin {
    editGroup(args: $args)
  }
}
`;

const EditGroupMutation = ({ children }: Props) => (
  <Mutation
    mutation={REQUEST}
  >
    {children}
  </Mutation>
);

export default EditGroupMutation;
