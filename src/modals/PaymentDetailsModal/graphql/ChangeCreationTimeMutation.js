import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation PaymentDetailsModal_ChangeCreationTimeMutation(
    $paymentId: String!
    $creationTime: String!
  ) {
    payment {
      changeCreationTime (
        paymentId: $paymentId
        creationTime: $creationTime
      )
    }
  }`;

const ChangeCreationTimeMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ChangeCreationTimeMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChangeCreationTimeMutation;
