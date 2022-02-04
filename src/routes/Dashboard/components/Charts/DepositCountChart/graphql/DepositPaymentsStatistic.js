import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { tradingStatuses, tradingTypes } from 'constants/payment';
import { initialPaymentQueryParams } from '../../dashboardChartsUtils';

export const REQUEST = gql`
  query DepositCountChart_getPaymentsStatistic(
    $dateFrom: String
    $dateTo: String
    $detalization: StatisticDetalization__Enum
    $paymentStatus: String
    $paymentType: String
    $additionalStatistics: [PaymentStatisticDateRange__Input]
  ) {
    paymentsStatistic(
      dateFrom: $dateFrom
      dateTo: $dateTo
      detalization: $detalization
      paymentStatus: $paymentStatus
      paymentType: $paymentType
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

const DepositPaymentsStatistic = ({ children }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{
      ...initialPaymentQueryParams(
        'dateFrom',
        'dateTo',
        {
          paymentType: tradingTypes.DEPOSIT,
          paymentStatus: tradingStatuses.COMPLETED,
        },
      ),
    }}
  >
    {children}
  </Query>
);

DepositPaymentsStatistic.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DepositPaymentsStatistic;
