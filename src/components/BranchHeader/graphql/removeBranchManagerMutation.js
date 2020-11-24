import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation BranchHeader_removeBranchManagerMutation(
    $branchUuid: String!,
  ) {
    hierarchy {
      removeBranchManager(
        branchUuid: $branchUuid,
      )
    }
  }
`;

const removeBranchManagerMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

removeBranchManagerMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default removeBranchManagerMutation;
