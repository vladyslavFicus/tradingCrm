import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`mutation TradingEngine_CreateSymbolMutation(
   $args: TradingEngineCreateSymbolAdmin__Input
) {
  tradingEngineAdmin {
    createSymbol(args: $args)
  }
}
`;

const CreateSymbolMutation = ({ children }: Props) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

export default CreateSymbolMutation;
