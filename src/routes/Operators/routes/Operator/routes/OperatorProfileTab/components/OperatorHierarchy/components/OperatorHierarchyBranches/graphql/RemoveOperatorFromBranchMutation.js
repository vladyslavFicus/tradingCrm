import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation OperatorDepartmnets_removeOperatorFromBranch(
    $branchId: String!
    $operatorId: String!
  ) {
    operator {
      removeOperatorFromBranch (
        branchId: $branchId
        operatorId: $operatorId
      )
    }
  }
`;

const RemoveOperatorFromBranchMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

RemoveOperatorFromBranchMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default RemoveOperatorFromBranchMutation;
