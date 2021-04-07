import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation UpdateShowFTDMutation(
    $allowFirstTimeDeposit: Boolean!
    $playerUUID: String
  ) {
    profile {
      updateShowFTD(
        allowFirstTimeDeposit: $allowFirstTimeDeposit
        playerUUID: $playerUUID
      )
    }
  }
`;

const UpdateShowFTDMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateShowFTDMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateShowFTDMutation;
