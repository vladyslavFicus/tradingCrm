import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`mutation TradingEngine_EditSecurityMutation(
   $securityName: String!
   $name: String!
   $description: String
) {
  tradingEngineAdmin {
    editSecurity(
      securityName: $securityName
      name: $name
      description: $description
    )
  }
}
`;

const EditSecurityMutation = ({ children }: Props) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

export default EditSecurityMutation;
