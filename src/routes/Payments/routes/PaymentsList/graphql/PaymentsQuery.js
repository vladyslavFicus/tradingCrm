import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';
import { statusMapper } from 'constants/payment';

const REQUEST = gql`
  query PaymentsQuery($args: PaymentSearch__Input) {
    payments(args: $args) {
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
        cryptoAmount
        cryptoCurrency
      }
    }
  }
`;

const PaymentsQuery = ({ children, location: { state } }) => (
  <Query
    query={REQUEST}
    variables={{
      args: {
        ...state?.filters ? state.filters : { accountType: 'LIVE' },
        statuses: state?.filters?.statuses?.map(item => statusMapper[item]).flat(Infinity),
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    }}
    fetchPolicy="cache-and-network"
    errorPolicy="all"
    context={{ batch: false }}
  >
    {children}
  </Query>
);

PaymentsQuery.propTypes = {
  ...PropTypes.router,
  children: PropTypes.func.isRequired,
};

export default PaymentsQuery;
