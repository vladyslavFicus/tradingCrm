import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation UpdateKYCStatusMutation_KYCStatus(
    $playerUUID: String!,
    $kycStatus: String,
  ) {
    profile {
      updateKYCStatus(
        playerUUID: $playerUUID,
        kycStatus: $kycStatus,
      ) {
        success
      }
    }
  }`;

const UpdateKYCStatusMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateKYCStatusMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateKYCStatusMutation;
