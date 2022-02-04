import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation UpdateTeamModal_UpdateBranch(
    $uuid: String!
    $name: String!
  ) {
    hierarchy {
      updateBranch (
        uuid: $uuid
        name: $name
      )
    }
  }
`;

const UpdateTeamMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateTeamMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateTeamMutation;
