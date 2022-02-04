import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation ClientKycForm_UpdateClientKycMutation(
    $playerUUID: String!
    $kycStatus: String
  ) {
    profile {
      updateKYCStatus(
        playerUUID: $playerUUID
        kycStatus: $kycStatus
      )
    }
  }
`;

const UpdateClientKycMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateClientKycMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateClientKycMutation;
