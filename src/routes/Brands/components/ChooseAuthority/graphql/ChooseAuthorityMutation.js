import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation Authorities__ChooseAuthorityMutation(
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

const ChooseAuthorityMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ChooseAuthorityMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChooseAuthorityMutation;
