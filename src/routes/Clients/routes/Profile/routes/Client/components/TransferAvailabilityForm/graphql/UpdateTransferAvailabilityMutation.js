import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation updateTransferAvailabilityMutation_UpdateTransferAvailabilityForm(
    $playerUUID: String!,
    $internalTransfer: Boolean,
  ) {
    profile {
      updateConfiguration(
        playerUUID: $playerUUID,
        internalTransfer: $internalTransfer,
      )
    }
  }`;

const UpdateTransferAvailabilityMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateTransferAvailabilityMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateTransferAvailabilityMutation;
