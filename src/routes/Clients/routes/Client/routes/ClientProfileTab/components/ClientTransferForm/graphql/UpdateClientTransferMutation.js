import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation ClientTransferForm_UpdateClientTransferMutation(
    $playerUUID: String!
    $internalTransfer: Boolean
  ) {
    profile {
      updateConfiguration(
        playerUUID: $playerUUID
        internalTransfer: $internalTransfer
      )
    }
  }
`;

const UpdateClientTransferMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateClientTransferMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateClientTransferMutation;
