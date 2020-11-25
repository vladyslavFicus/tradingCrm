import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { getBrand } from 'config';

const REQUEST = gql`
  mutation PasswordResetRequestMutation(
    $playerUUID: String!
  ) {
    auth {
      resetUserPassword(userUuid: $playerUUID)
    }
  }`;

const PasswordResetRequestMutation = ({ children }) => (
  <Mutation mutation={REQUEST} variables={{ brandId: getBrand().id }}>
    {children}
  </Mutation>
);

PasswordResetRequestMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PasswordResetRequestMutation;
