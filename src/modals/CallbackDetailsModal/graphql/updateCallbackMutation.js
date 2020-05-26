import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation CallbackDetailsModal_updateCallback(
    $callbackId: String!,
    $callbackTime: String,
    $operatorId: String,
    $status: CallbackStatusEnum,
    $reminder: String,
  ) {
    callback {
      update(
        callbackId: $callbackId,
        callbackTime: $callbackTime,
        operatorId: $operatorId,
        status: $status,
        reminder: $reminder,
      ) {
        data {
          _id
          callbackTime
          operatorId
          status
          reminder
          operator {
            fullName
          }
        }
        error {
          error
          fields_errors
        }
      }
    }
  }
`;

const updateCallbackMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

updateCallbackMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default updateCallbackMutation;
