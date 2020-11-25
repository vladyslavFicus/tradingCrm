import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation ChangeUnauthorizedPasswordModal_ChangeUnauthorizedPasswordMutation(
    $uuid: String!
    $currentPassword: String!
    $newPassword: String!
  ) {
    auth {
      changeUnauthorizedPassword (
        uuid: $uuid
        currentPassword: $currentPassword
        newPassword: $newPassword
      )
    }
  }
`;

const ChangeUnauthorizedPasswordMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ChangeUnauthorizedPasswordMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChangeUnauthorizedPasswordMutation;
