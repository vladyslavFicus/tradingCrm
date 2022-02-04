import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation CreateCallbackModal_CreateCallbackMutation(
    $userId: String!,
    $reminder: String,
    $operatorId: String!,
    $callbackTime: String!,
  ) {
    callback {
      create(
        userId: $userId,
        reminder: $reminder,
        operatorId: $operatorId,
        callbackTime: $callbackTime,
      ) {
        callbackId
      }
    }
  }
`;

const CreateCallbackMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CreateCallbackMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CreateCallbackMutation;
