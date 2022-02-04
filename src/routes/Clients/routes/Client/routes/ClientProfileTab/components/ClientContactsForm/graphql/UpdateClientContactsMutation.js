import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { ContactsFragment } from 'apollo/fragments/contacts';

const REQUEST = gql`
  mutation ClientContactsForm_UpdateClientContactsMutation(
    $playerUUID: String!
    $phone: String
    $additionalPhone: String
    $additionalEmail: String
  ) {
    profile {
      updateContacts(
        playerUUID: $playerUUID
        phone: $phone
        additionalPhone: $additionalPhone
        additionalEmail: $additionalEmail
      ) {
        _id
        phoneVerified
        contacts {
          ...ContactsFragment
        }
      }
    }
  }
${ContactsFragment}`;

const UpdateClientContactsMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateClientContactsMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateClientContactsMutation;
