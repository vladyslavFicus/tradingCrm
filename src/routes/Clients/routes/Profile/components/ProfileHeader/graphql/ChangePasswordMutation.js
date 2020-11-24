import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation ChangePasswordMutation(
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

const ChangePasswordMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ChangePasswordMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChangePasswordMutation;
