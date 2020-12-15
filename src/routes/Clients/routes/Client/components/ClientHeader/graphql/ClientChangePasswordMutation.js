import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation ClientHeader_ClientChangePasswordMutation(
    $clientUuid: String!
    $newPassword: String!
  ) {
    auth {
      changePassword(
        clientUuid: $clientUuid
        newPassword: $newPassword
      )
    }
  }`;

const ClientChangePasswordMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ClientChangePasswordMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ClientChangePasswordMutation;
