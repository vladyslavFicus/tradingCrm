import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
