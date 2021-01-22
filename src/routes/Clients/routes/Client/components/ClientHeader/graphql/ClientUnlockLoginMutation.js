import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
