import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation VerifyPhoneMutation_ContactForm(
    $playerUUID: String!
    $phone: String
  ) {
    profile {
      verifyPhone(
        playerUUID: $playerUUID
        phone: $phone
      ) {
        _id
        phoneVerified
      }
    }
  }`;

const VerifyPhoneMutation = ({ children, playerUUID }) => (
  <Mutation mutation={REQUEST} variables={{ playerUUID }}>
    {children}
  </Mutation>
);

VerifyPhoneMutation.propTypes = {
  children: PropTypes.func.isRequired,
  playerUUID: PropTypes.string.isRequired,
};

export default VerifyPhoneMutation;
