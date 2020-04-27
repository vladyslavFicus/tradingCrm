import React from 'react';
import { get } from 'lodash';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query PaymentsQuery($args: PaymentsByUuidInputType) {
    clientPaymentsByUuid(args: $args) {
      data {
        page
        number
        totalElements
        size
        last
        content {
          _id
          login
          platformType
          accountType
          paymentId
          paymentType
          status
          withdrawStatus
          currency
          createdBy
          creationTime
          paymentMethod
          paymentAggregator
          amount
          country
          language
          brandId
          externalReference
          paymentMigrationId
          userMigrationId
          normalizedAmount
          declineReason
          playerProfile {
            uuid
            firstName
            lastName
            fullName
            country
          }
          paymentMetadata {
            clientIp
            isMobile
            userAgent
            country
          }
          originalAgent {
            uuid
            fullName
          }
          note {
            _id
            noteId
            targetUUID
            playerUUID
            subject
            content
            pinned
            changedAt
            changedBy
            operator {
              fullName
            }
          }
          modifiedBy
          statusChangedAt
          warnings
        }
      }
      error {
        error
      }
    }
  }
`;

const PaymentsQuery = ({
  children,
  location: { query },
  match: { params: { id: playerUUID } },
}) => (
  <Query
    query={REQUEST}
    variables={{
      args: {
        accountType: 'LIVE',
        ...(query && query.filters),
        playerUUID,
        page: {
          from: 0,
          size: 20,
          sorts: get(query, 'sorts') || [],
        },
      },
    }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

PaymentsQuery.propTypes = {
  ...PropTypes.router,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  children: PropTypes.func.isRequired,
};

export default PaymentsQuery;
