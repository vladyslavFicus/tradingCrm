import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { AddressFragment } from 'graphql/fragments/address';

const REQUEST = gql`
  mutation updateAddressMutation_AddressForm(
    $playerUUID: String!
    $countryCode: String
    $city: String
    $state: String
    $postCode: String
    $poBox: String
    $address: String
  ) {
    profile {
      updateAddress(
        playerUUID: $playerUUID
        countryCode: $countryCode
        city: $city
        state: $state
        postCode: $postCode
        poBox: $poBox
        address: $address
      ) {
        _id
        address {
          ...AddressFragment
        }
      }
    }
  }
${AddressFragment}`;

const UpdateAddressMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateAddressMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateAddressMutation;
