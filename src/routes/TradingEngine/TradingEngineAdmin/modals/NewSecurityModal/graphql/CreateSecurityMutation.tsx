import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`mutation TradingEngine_CreateSecurityMutation(
   $name: String!
   $description: String
) {
  tradingEngineAdmin {
    createSecurity(
      name: $name
      description: $description
    )
  }
}
`;

const CreateSecurityMutation = ({ children }: Props) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

export default CreateSecurityMutation;
