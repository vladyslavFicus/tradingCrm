import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation OperatorHierarchyUserType_UpdateOperatorUserTypeMutation(
    $operatorId: String!
    $userType: String
  ) {
    operator {
      updateOperatorUserType (
        operatorId: $operatorId
        userType: $userType
      )
    }
  }
`;

const UpdateOperatorUserTypeMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateOperatorUserTypeMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateOperatorUserTypeMutation;
