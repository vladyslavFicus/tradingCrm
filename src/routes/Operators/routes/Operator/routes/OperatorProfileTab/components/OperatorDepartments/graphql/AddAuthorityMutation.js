import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation OperatorDepartmnets_addAuthority(
  $uuid: String!
  $department: String!
  $role: String!
) {
  auth {
    addAuthority(
      uuid: $uuid
      department: $department
      role: $role
    )
  }
}`;

const AddAuthorityMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

AddAuthorityMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AddAuthorityMutation;
