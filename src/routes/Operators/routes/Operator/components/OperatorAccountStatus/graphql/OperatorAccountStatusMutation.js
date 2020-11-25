import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation OperatorAccountStatus_OperatorAccountStatus(
    $uuid: String!
    $reason: String!
    $status: String!
  ) {
    operator {
      changeStatus(
        uuid: $uuid
        reason: $reason
        status: $status
      )
    }
  }
`;

const OperatorAccountStatusMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

OperatorAccountStatusMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default OperatorAccountStatusMutation;
