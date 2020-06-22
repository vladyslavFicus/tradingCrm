import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation PartnerHeader_unlockPartnerLoginMutation(
    $uuid: String!
  ) {
    auth {
      unlockLogin(
        playerUUID: $uuid
      ) {
        success
        error {
          error
        }
      }
    }
  }
`;

const unlockPartnerLoginMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

unlockPartnerLoginMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default unlockPartnerLoginMutation;
