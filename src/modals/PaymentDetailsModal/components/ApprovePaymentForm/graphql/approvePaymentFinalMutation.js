import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation PaymentApproveButton_approvePaymentFinalMutation(
    $paymentId: String!
    $paymentMethod: String
  ) {
    payment {
      acceptPaymentFinal (
        paymentId: $paymentId
        paymentMethod: $paymentMethod
      ) {
        data {
          success
        }
      }
    }
  }
`;

const approvePaymentFinalMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

approvePaymentFinalMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default approvePaymentFinalMutation;
