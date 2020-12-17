import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation ExistingOperatorModal_AddExistingOperator(
    $branchId: String
    $department: String!
    $email: String!
    $role: String!
  ) {
    operator {
      addExistingOperator(
        email: $email
        department: $department
        role: $role
        branchId: $branchId
      ) {
        uuid
      }
    }
  }
`;

const AddExistingOperatorMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

AddExistingOperatorMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AddExistingOperatorMutation;
