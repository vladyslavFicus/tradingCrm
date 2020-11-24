import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation UnlockLoginMutation(
    $playerUUID: String!
  ) {
    auth {
      unlockLogin(uuid: $playerUUID)
    }
  }`;

const UnlockLoginMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UnlockLoginMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UnlockLoginMutation;
