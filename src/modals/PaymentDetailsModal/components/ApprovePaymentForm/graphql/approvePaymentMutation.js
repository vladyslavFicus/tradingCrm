import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation PaymentApproveButton_approvePaymentMutation(
    $paymentId: String!
    $typeAcc: String
  ) {
    payment {
      acceptPayment (
        paymentId: $paymentId
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
