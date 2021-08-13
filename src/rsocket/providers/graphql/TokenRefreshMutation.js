import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

const REQUEST = gql`
  mutation RSocket__TokenRefreshMutation {
    auth {
      tokenRenew {
        token
      }
    }
  }
`;

const TokenRequestMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

TokenRequestMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default TokenRequestMutation;
