import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const MUTATION = gql`
  mutation LogoutMutation {
    auth {
      logout
    }
  }
`;

const LogoutMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

LogoutMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default LogoutMutation;
