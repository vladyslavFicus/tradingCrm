import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation UnlockLoginMutation(
    $playerUUID: String!
  ) {
    auth {
      unlockLogin(playerUUID: $playerUUID) {
        success
        error {
          error
        }
      }
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
