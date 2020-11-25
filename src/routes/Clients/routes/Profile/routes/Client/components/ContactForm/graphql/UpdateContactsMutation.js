import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { ContactsFragment } from 'graphql/fragments/contacts';

const REQUEST = gql`
  mutation UpdateContactsMutation_ContactForm(
    $playerUUID: String!,
    $phone: String,
    $additionalPhone: String,
    $additionalEmail: String,
  ) {
    profile {
      updateContacts(
        additionalPhone: $additionalPhone,
        additionalEmail: $additionalEmail,
        playerUUID: $playerUUID,
        phone: $phone,
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

const UpdateContactsMutation = ({ children, playerUUID }) => (
  <Mutation mutation={REQUEST} variables={{ playerUUID }}>
    {children}
  </Mutation>
);

UpdateContactsMutation.propTypes = {
  children: PropTypes.func.isRequired,
  playerUUID: PropTypes.string.isRequired,
};

export default UpdateContactsMutation;
