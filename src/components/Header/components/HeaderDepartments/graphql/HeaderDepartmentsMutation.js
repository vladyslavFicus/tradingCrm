import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation HeaderDepartments_chooseDepartmentMutation(
    $brand: String!
    $department: String!
    $role: String!
  ) {
    auth {
      chooseDepartment(
        brand: $brand,
        department: $department
        role: $role
      ) {
        uuid
        token
      }
    }
  }
`;

const HeaderDepartmentsMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

HeaderDepartmentsMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default HeaderDepartmentsMutation;
