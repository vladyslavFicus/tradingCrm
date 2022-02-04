import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation ClientContactForm_VerifyEmailMutation(
    $playerUUID: String!
  ) {
    profile {
      verifyEmail(playerUUID: $playerUUID) {
        _id
        emailVerified
      }
    }
  }`;

const VerifyEmailMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

VerifyEmailMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default VerifyEmailMutation;
