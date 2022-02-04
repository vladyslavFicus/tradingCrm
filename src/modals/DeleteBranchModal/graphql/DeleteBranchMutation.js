import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation DeleteBranchModal_DeleteBranch($uuid: String!) {
    hierarchy {
      deleteBranch (uuid: $uuid)
    }
  }
`;

const DeleteBranchMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DeleteBranchMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DeleteBranchMutation;
