import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation OperatorDepartmnets_removeAuthority(
  $uuid: String!
  $department: String!
  $role: String!
) {
  auth {
    removeAuthority(
      uuid: $uuid
      department: $department
      role: $role
    )
  }
}
`;

const RemoveAuthorityMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

RemoveAuthorityMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default RemoveAuthorityMutation;
