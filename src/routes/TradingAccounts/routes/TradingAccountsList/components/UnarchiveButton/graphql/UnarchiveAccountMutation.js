import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import PropTypes from 'prop-types';
import React from 'react';

const REQUEST = gql`
  mutation UnarchiveAccount(
    $uuid: String!
  ) {
    tradingAccount {
      unarchive (
        uuid: $uuid,
      )
    }
  }
`;

const UnarchiveAccountMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UnarchiveAccountMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UnarchiveAccountMutation;
