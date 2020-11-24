import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation PaymentRejectButton_rejectPaymentMutation(
    $typeAcc: String!
    $paymentId: String!
    $declineReason: String
  ) {
    payment {
      acceptPayment (
        typeAcc: $typeAcc
        paymentId: $paymentId
        declineReason: $declineReason
      )
    }
  }
`;

const rejectPaymentMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

rejectPaymentMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default rejectPaymentMutation;
