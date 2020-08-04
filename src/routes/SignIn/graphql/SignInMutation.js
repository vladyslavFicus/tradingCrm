import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation SignIn__SignInMutation(
    $login: String!
    $password: String!
  ) {
    auth {
      signIn(
        login: $login
        password: $password
      ) {
        uuid
        brandToAuthorities
        token
      }
    }
  }
`;

const SignInMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

SignInMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default SignInMutation;
