import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation SignInMutation(
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
