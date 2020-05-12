import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation CreateCallbackModal_createCallbackMutation(
    $userId: String!,
    $operatorId: String!,
    $callbackTime: String!,
  ) {
    callback {
      create(
        userId: $userId,
        operatorId: $operatorId,
        callbackTime: $callbackTime,
      ) {
        data {
          _id
          callbackId
          callbackTime
          operatorId
          status
          operator {
            fullName
          }
        }
        error {
          error
        }
      }
    }
  }
`;

const createCallbackMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

createCallbackMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default createCallbackMutation;
