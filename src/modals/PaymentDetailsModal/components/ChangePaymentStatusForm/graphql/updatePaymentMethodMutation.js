import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation ChangePaymentStatusForm_updatePaymentMethod(
    $paymentId: String!,
    $paymentMethod: String,
  ) {
    payment {
      changePaymentMethod (
        paymentId: $paymentId,
        paymentMethod: $paymentMethod,
      )
    }
  }
`;

const updatePaymentMethodMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

updatePaymentMethodMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default updatePaymentMethodMutation;
