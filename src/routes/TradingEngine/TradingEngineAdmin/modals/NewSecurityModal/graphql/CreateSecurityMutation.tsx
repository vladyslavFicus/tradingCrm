import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Children } from 'types/children';

export interface Props {
  children: Children;
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
