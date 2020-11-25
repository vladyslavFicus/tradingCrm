import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
