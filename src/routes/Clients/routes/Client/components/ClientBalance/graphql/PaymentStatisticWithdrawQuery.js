import React from 'react';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import moment from 'moment';

const REQUEST = gql`
  query ClientBalance_PaymentStatisticWithdrawQuery(
    $dateFrom: String
    $dateTo: String
    $detalization: StatisticDetalization__Enum
    $paymentStatus: String
    $paymentType: String
    $profileId: String
    $additionalStatistics: [PaymentStatisticDateRange__Input]
  ) {
    paymentsStatistic(
      dateFrom: $dateFrom
      dateTo: $dateTo
      detalization: $detalization
      paymentStatus: $paymentStatus
      paymentType: $paymentType
      profileId: $profileId
      additionalStatistics: $additionalStatistics
    ) {
      items {
        amount
        count
        entryDate
      }
      itemsTotal {
        totalAmount
        totalCount
      }
      additionalTotal {
        totalAmount
        totalCount
        todayAmount
        todayCount
        monthAmount
        monthCount
      }
    }
  }
`;

const PaymentStatisticWithdrawQuery = ({ clientUuid, registrationDate, children }) => (
  <Query
    query={REQUEST}
    variables={{
      profileId: clientUuid,
      paymentType: 'WITHDRAW',
      // paymentStatus: 'COMPLETED',
      detalization: 'PER_DAYS',
      additionalStatistics: [],
      dateFrom: moment(registrationDate).utc().format(),
      dateTo: moment().utc().add(2, 'day').startOf('day')
        .format(),
    }}
  >
    {children}
  </Query>
);

PaymentStatisticWithdrawQuery.propTypes = {
  children: PropTypes.func.isRequired,
  clientUuid: PropTypes.string.isRequired,
  registrationDate: PropTypes.string.isRequired,
};

export default PaymentStatisticWithdrawQuery;
