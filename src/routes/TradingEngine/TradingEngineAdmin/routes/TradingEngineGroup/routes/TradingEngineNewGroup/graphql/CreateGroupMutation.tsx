import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`mutation TradingEngine_CreateGroupMutation(
   $args: TradingEngineCreateGroupAdmin__Input
) {
  tradingEngineAdmin {
    createGroup(args: $args)
  }
}
`;

const CreateGroupMutation = ({ children }: Props) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

export default CreateGroupMutation;
