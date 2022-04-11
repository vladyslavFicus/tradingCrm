import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation PermissionSetting_ResetPermissionMutation(
    $department: String!
    $role: String!
  ) {
    auth {
      resetPermission(
        department: $department
        role: $role
      )
    }
  }
`;

const ResetPermissionMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ResetPermissionMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ResetPermissionMutation;
