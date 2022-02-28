import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation UpdateConfigurationMutation(
  $playerUUID: String!,
  $internalTransfer: Boolean,
  $crs: Boolean,
  $fatca: Boolean,
) {
  profile {
    updateConfiguration(
      playerUUID: $playerUUID,
      internalTransfer: $internalTransfer,
      crs: $crs,
      fatca: $fatca,
    )
  }
}
`;

const UpdateConfigurationMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateConfigurationMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateConfigurationMutation;
