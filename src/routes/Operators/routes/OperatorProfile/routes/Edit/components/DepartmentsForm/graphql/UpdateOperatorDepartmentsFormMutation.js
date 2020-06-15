import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation UpdateOperatorDepartmentsFormMutation_addDepartment(
  $uuid: String!,
  $department: String!,
  $role: String!,
) {
  operator {
    addDepartment(
      uuid: $uuid,
      department: $department,
      role: $role,
    ) {
      data {
        authorities {
          brand
          department
          id
          role
        }
      }
      error {
        error
      }
    }
  }
}`;

const UpdateOperatorDepartmentsFormMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateOperatorDepartmentsFormMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateOperatorDepartmentsFormMutation;
