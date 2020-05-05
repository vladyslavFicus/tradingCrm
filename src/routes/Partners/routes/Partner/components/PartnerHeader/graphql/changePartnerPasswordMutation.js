import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation PartnerHeader_changePartnerPasswordMutation(
    $uuid: String!,
    $password: String!
  ) {
    profile {
      changePassword(
        playerUUID: $uuid
        password: $password
      ) {
        success
      }
    }
  }
`;

const changePartnerPasswordMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

changePartnerPasswordMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default changePartnerPasswordMutation;
