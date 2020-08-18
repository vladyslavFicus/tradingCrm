import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation Departments__ChooseDepartmentMutation(
    $brand: String!
    $department: String!
    $role: String!
  ) {
    auth {
      chooseDepartment(
        brand: $brand
        department: $department
        role: $role
      ) {
        uuid
        token
      }
    }
  }
`;

const ChooseDepartmentMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ChooseDepartmentMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChooseDepartmentMutation;
