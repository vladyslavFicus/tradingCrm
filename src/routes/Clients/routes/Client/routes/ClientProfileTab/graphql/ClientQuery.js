import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';
import { ContactsFragment } from 'apollo/fragments/contacts';
import { AddressFragment } from 'apollo/fragments/address';

const REQUEST = gql`
  query ClientPersonalForm_ClientQuery(
    $playerUUID: String!
  ) {
    profile(playerUUID: $playerUUID) {
      _id
      uuid
      birthDate
      firstName
      gender
      identificationNumber
      languageCode
      lastUpdatedBy
      lastName
      migrationId
      emailVerified
      phoneVerified
      timeZone
      affiliate {
        uuid
        partner {
          permission {
            minFtdDeposit
          }
        }
      }
      address {
        ...AddressFragment
      }
      configuration {
        internalTransfer
      }
      contacts {
        ...ContactsFragment
      }
      passport {
        countryOfIssue
        countrySpecificIdentifier
        countrySpecificIdentifierType
        expirationDate
        issueDate
        number
      }
      kyc {
        status
      }
      profileView {
        uuid
        paymentDetails {
          depositsCount
        }
        affiliate {
          uuid
          ftd {
            isVisible
          }
        }
      }
    }
  }
  ${ContactsFragment}
  ${AddressFragment}
`;

const ClientQuery = ({ children, match: { params: { id } } }) => (
  <Query
    query={REQUEST}
    variables={{ playerUUID: id }}
    fetchPolicy="cache-and-network"
    errorPolicy="all"
  >
    {children}
  </Query>
);

ClientQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ClientQuery;
