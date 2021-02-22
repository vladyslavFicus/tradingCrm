import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
