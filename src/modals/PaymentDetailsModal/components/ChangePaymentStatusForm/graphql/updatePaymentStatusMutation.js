import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation ChangePaymentStatusForm_updatePaymentStatus(
    $paymentId: String!,
    $paymentStatus: String,
  ) {
    payment {
      changePaymentStatus (
        paymentId: $paymentId,
        paymentStatus: $paymentStatus,
      )
    }
  }
`;

const updatePaymentStatusMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

updatePaymentStatusMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default updatePaymentStatusMutation;
