import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`
  mutation ChangePaymentSystemForm_UpdatePaymentSystem(
    $paymentId: String!,
    $paymentSystem: String!,
  ) {
    payment {
      changePaymentSystem (
        paymentId: $paymentId,
        paymentSystem: $paymentSystem,
      )
    }
  }
`;

const UpdatePaymentSystemMutation = ({ children }: Props) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

export default UpdatePaymentSystemMutation;
