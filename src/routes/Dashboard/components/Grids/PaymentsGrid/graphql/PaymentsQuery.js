import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import { statuses, statusMapper } from 'constants/payment';

const REQUEST = gql`
  query PaymentsQuery($args: PaymentInputType) {
    payments(args: $args) {
      data {
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

const PaymentsQuery = ({ children, paymentTypes, size }) => (
  <Query
    query={REQUEST}
    variables={{
      args: {
        page: {
          from: 0,
          size,
        },
        statuses: statusMapper[statuses.COMPLETED],
        paymentTypes,
      },
    }}
  >
    {children}
  </Query>
);

PaymentsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  paymentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PaymentsQuery;
