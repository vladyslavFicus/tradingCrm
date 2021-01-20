import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation ClientFilesTab_TokenRefreshMutation {
    auth {
      tokenRenew {
        token
      }
    }
  }
`;

const TokenRefreshMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

TokenRefreshMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default TokenRefreshMutation;
