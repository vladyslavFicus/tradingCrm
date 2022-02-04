import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation CreateOperatorModal__createOperator(
    $branchId: String
    $department: String!
    $email: String!
    $firstName: String!
    $lastName: String!
    $password: String!
    $phone: String
    $role: String!
    $userType: String!
  ) {
    operator {
      createOperator(
        branchId: $branchId
        department: $department
        email: $email
        firstName: $firstName
        lastName: $lastName
        phone: $phone
        password: $password
        role: $role
        userType: $userType
      ) {
        uuid
      }
    }
  }
`;

const CreatePartnerMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CreatePartnerMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CreatePartnerMutation;
