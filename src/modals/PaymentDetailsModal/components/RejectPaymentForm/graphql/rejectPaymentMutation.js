import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation PaymentRejectButton_rejectPaymentMutation(
    $typeAcc: String
    $paymentId: String!
    $declineReason: String
  ) {
    payment {
      acceptPayment (
        typeAcc: $typeAcc
        paymentId: $paymentId
        declineReason: $declineReason
      ) {
        data {
          success
        }
      }
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
