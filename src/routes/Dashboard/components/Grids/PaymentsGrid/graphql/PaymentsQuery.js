import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';
import { statuses, statusMapper } from 'constants/payment';

const REQUEST = gql`
  query PaymentsQuery($args: PaymentSearch__Input) {
    payments(args: $args) @connection(key: $connectionKey) {
      last
      content {
        _id
        login
        platformType
        accountType
        paymentId
        paymentType
        status
        currency
        createdBy
        creationTime
        bankName
        maskedPan
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
        partner {
          fullName
        }
        playerProfile {
          uuid
          firstName
          lastName
          country
          affiliateUuid
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
  }
`;

const PaymentsQuery = ({ children, paymentTypes, size, connectionKey }) => (
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
      connectionKey,
    }}
    errorPolicy="all"
  >
    {children}
  </Query>
);

PaymentsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  paymentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  connectionKey: PropTypes.string.isRequired,
};

export default PaymentsQuery;
