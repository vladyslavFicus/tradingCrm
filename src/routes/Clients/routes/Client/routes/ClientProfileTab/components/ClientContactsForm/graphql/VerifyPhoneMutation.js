import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

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
  }
`;

const VerifyPhoneMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

VerifyPhoneMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default VerifyPhoneMutation;
