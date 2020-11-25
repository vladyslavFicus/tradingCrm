import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

const REQUEST = gql`
  mutation RolesAndPermissions_UpdateAuthorityActionsMutation(
    $department: String!
    $role: String!
    $actions: [String]!
    $isPermitted: Boolean!
  ) {
    auth {
      updateAuthorityActions(
        department: $department
        role: $role
        actions: $actions
        isPermitted: $isPermitted
      )
    }
  }
`;

const UpdateAuthorityActionsMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateAuthorityActionsMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateAuthorityActionsMutation;
