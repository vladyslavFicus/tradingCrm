import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

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
