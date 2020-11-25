import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation VerifyPhoneMutation_ContactForm($playerUUID: String!) {
    profile {
      verifyPhone(playerUUID: $playerUUID) {
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
