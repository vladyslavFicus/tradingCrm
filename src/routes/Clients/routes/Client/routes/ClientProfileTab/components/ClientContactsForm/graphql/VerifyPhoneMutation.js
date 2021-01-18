import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation ClientContactForm_VerifyPhoneMutation(
    $playerUUID: String!
  ) {
    profile {
      verifyPhone(playerUUID: $playerUUID) {
        _id
        phoneVerified
      }
    }
  }`;

const VerifyPhoneMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

VerifyPhoneMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default VerifyPhoneMutation;
