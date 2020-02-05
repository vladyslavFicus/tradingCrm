import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation HeaderDepartments_chooseDepartmentMutation(
    $brandId: String!,
    $department: String!
  ) {
    authorization {
      chooseDepartment(
        brandId: $brandId,
        department: $department
      ) {
        data {
          uuid
          token
        }
        error {
          error
          fields_errors
        }
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
