import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation OperatorDepartmnets_addOperatorToBranch(
    $branchId: String!
    $operatorId: String!
  ) {
    operator {
      addOperatorToBranch (
        branchId: $branchId
        operatorId: $operatorId
      )
    }
  }
`;

const AddOperatorToBranchMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

AddOperatorToBranchMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AddOperatorToBranchMutation;
