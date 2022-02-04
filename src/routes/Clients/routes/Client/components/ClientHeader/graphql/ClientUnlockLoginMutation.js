import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation ClientHeader_ClientUnlockLoginMutation(
    $playerUUID: String!
  ) {
    auth {
      unlockLogin(uuid: $playerUUID)
    }
  }`;

const ClientUnlockLoginMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ClientUnlockLoginMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ClientUnlockLoginMutation;
