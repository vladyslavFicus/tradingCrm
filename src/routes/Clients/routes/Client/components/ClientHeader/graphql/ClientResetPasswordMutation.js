import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { getBrand } from 'config';

const REQUEST = gql`
  mutation ClientHeader_ClientResetPasswordMutation(
    $playerUUID: String!
  ) {
    auth {
      resetUserPassword(userUuid: $playerUUID)
    }
  }`;

const ClientResetPasswordMutation = ({ children }) => (
  <Mutation mutation={REQUEST} variables={{ brandId: getBrand().id }}>
    {children}
  </Mutation>
);

ClientResetPasswordMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ClientResetPasswordMutation;
