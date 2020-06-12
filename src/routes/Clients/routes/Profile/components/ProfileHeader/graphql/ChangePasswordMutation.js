import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation ChangePasswordMutation(
    $playerUUID: String!
    $newPassword: String!
  ) {
    profile {
      changePassword(
        clientUuid: $playerUUID
        newPassword: $newPassword
      ) {
        success
      }
    }
  }`;

const ChangePasswordMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ChangePasswordMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChangePasswordMutation;
