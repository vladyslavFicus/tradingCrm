import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation AddBranchManagerModal_addBranchManagerMutation(
    $branchUuid: String!,
    $operatorUuid: String!
  ) {
    hierarchy {
      addBranchManager(
        branchUuid: $branchUuid,
        operatorUuid: $operatorUuid
      )
    }
  }
`;

const addBranchManagerMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

addBranchManagerMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default addBranchManagerMutation;
