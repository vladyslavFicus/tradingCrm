import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
