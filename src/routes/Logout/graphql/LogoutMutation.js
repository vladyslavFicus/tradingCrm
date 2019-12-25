import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation LogoutMutation {
    auth {
      logout {
        success
      }
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
