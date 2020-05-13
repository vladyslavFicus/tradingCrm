import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation PaymentApproveButton_approvePaymentMutation(
    $paymentId: String!
    $paymentMethod: String!
    $typeAcc: String
  ) {
    payment {
      acceptPayment (
        paymentId: $paymentId
        paymentMethod: $paymentMethod
        typeAcc: $typeAcc
      ) {
        data {
          success
        }
      }
    }
  }
`;

const approvePaymentMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

approvePaymentMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default approvePaymentMutation;
