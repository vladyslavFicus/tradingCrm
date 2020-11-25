import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation resetPassword(
    $password: String!
    $token: String!
  ) {
    auth {
      resetPassword(
        password: $password
        token: $token
      )
    }
  }
`;

const ResetPasswordMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ResetPasswordMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ResetPasswordMutation;
