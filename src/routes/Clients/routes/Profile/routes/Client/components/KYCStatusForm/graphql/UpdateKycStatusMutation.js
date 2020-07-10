import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation UpdateKycStatusMutation_KycStatusForm(
    $playerUUID: String!,
    $kycStatus: String,
  ) {
    profile {
      updateKYCStatus(
        playerUUID: $playerUUID,
        kycStatus: $kycStatus,
      )
    }
  }`;

const UpdateKycStatusMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateKycStatusMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateKycStatusMutation;
