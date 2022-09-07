import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation ExistingOperatorModal_AddExistingOperator(
    $branchId: String
    $department: String!
    $email: String!
    $role: String!
    $userType: String!
  ) {
    operator {
      addExistingOperator(
        email: $email
        department: $department
        role: $role
        branchId: $branchId
        userType: $userType
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
