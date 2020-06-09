import React from 'react';
import { get } from 'lodash';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query PaymentsQuery($args: PaymentInputType) {
    payments(args: $args) {
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
            country
          }
          paymentMetadata {
            clientIp
            mobile
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

const PaymentsQuery = ({ children, location: { query } }) => (
  <Query
    query={REQUEST}
    variables={{
      args: {
        accountType: 'LIVE',
        ...(query && query.filters),
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
  children: PropTypes.func.isRequired,
};

export default PaymentsQuery;
