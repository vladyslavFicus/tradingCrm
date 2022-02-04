import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation ClientAccountStatus_ChangeClientStatusMutation(
    $uuid: String!
    $reason: String!
    $comment: String
    $status: String!
  ) {
    profile {
      changeProfileStatus(
        playerUUID: $uuid
        reason: $reason
        comment: $comment
        status: $status
      ) {
        _id
        status {
          changedAt
          changedBy
          comment
          reason
          type
        }
      }
    }
  }
`;

const ChangeClientStatusMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ChangeClientStatusMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChangeClientStatusMutation;
