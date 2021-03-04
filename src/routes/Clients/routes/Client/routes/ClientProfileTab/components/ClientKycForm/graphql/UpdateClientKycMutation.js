import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
