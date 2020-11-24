import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
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
