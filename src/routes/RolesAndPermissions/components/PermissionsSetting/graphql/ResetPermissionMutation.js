import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
  }`;

const ResetPermissionMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ResetPermissionMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ResetPermissionMutation;
