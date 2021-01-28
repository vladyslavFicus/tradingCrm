import React from 'react';
import PropTypes from 'constants/propTypes';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ContactsFragment } from 'graphql/fragments/contacts';
import { AddressFragment } from 'graphql/fragments/address';

const AcquisitionFragment = gql`
  fragment AcquisitionFragment on HierarchyUserAcquisition {
    acquisitionStatus
    retentionRepresentative
    retentionStatus
    retentionOperator {
      fullName
      hierarchy {
        parentBranches {
          name
          branchType
          parentBranch {
            name
            branchType
          }
        }
      }
    }
    salesRepresentative
    salesStatus
    salesOperator {
      fullName
      hierarchy {
        parentBranches {
          name
          branchType
          parentBranch {
            name
            branchType
          }
        }
      }
    }
  }
`;

const REQUEST = gql`
  query Client_ClientQuery(
    $playerUUID: String!
  ) {
    profile(playerUUID: $playerUUID) {
      _id
      uuid
      age
      birthDate
      brandId
      clientType
      convertedFromLeadUuid
      firstName
      gender
      identificationNumber
      languageCode
      lastUpdatedBy
      lastUpdatedDate
      lastName
      migrationId
      emailVerified
      phoneVerified
      profileVerified
      timeZone
      address {
        ...AddressFragment
      }
      acquisition {
        ...AcquisitionFragment
      }
      affiliate {
        uuid
        externalId
        referral
        sms
        source
        campaignId
        partner {
          fullName
        }
      }
      configuration {
        crs
        fatca
        internalTransfer
        gdpr {
          sms
          email
          phone
          socialMedia
        }
        subscription {
          marketNews
          information
          educational
          promosAndOffers
          statisticsAndSummary
        }
        webCookies {
          enabled
        }
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
        uuid
      }
      registrationDetails {
        deviceDetails {
          deviceType
          operatingSystem
        }
        inetDetails {
          host
          ipAddress
          referer
        }
        locationDetails {
          city
          countryCode
          region
        }
        registeredBy
        registrationDate
        userAgent
      }
      status {
        changedAt
        changedBy
        comment
        reason
        type
      }
      profileView {
        balance {
          amount
          credit
        }
        lastSignInSessions {
          ip
          countryCode
          startedAt
        }
        lastActivity {
          location
          date
          eventType,
          eventValue,
        }
        online
      }
      tradingAccounts {
        accountUUID
        accountType
        archived
        balance
        credit
        currency
        group
        login
        margin
        name
        platformType
      }
      referrer {
        fullName
        uuid
      }
    }
  }
  ${ContactsFragment}
  ${AddressFragment}
  ${AcquisitionFragment}
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
