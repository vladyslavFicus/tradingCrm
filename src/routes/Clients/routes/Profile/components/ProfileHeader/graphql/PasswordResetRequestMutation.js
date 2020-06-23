import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { getBrandId } from 'config';

const REQUEST = gql`
  mutation PasswordResetRequestMutation(
    $playerUUID: String!
  ) {
    profile {
      passwordResetRequest(
        userUuid: $playerUUID
      ) {
        success
      }
    }
  }`;

const PasswordResetRequestMutation = ({ children }) => (
  <Mutation mutation={REQUEST} variables={{ brandId: getBrandId() }}>
    {children}
  </Mutation>
);

PasswordResetRequestMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PasswordResetRequestMutation;
