import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
