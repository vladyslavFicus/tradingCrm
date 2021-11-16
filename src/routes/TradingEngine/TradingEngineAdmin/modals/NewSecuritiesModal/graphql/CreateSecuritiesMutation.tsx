import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

export interface Props {
  children: any;
}

const REQUEST = gql`mutation TradingEngine_CreateSecuritiesMutation(
   $name: String!
   $description: String
) {
  tradingEngineAdmin {
    createSecurities(
      name: $name
      description: $description
    )
  }
}
`;

const CreateSecuritiesMutation = ({ children }: Props) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

export default CreateSecuritiesMutation;
