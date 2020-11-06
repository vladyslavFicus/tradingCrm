import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { AddressFragment } from 'graphql/fragments/address';

const REQUEST = gql`
  mutation updateAddressMutation_AddressForm(
    $clientUuid: String!
    $countryCode: String
    $city: String
    $state: String
    $postCode: String
    $poBox: String
    $address: String
  ) {
    profile {
      updateAddress(
        clientUuid: $clientUuid
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
