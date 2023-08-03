import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
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
