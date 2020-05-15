import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { tradingStatuses, tradingTypes } from 'constants/payment';
import { initialPaymentQueryParams } from '../../dashboardChartsUtils';

export const REQUEST = gql`
  query DepositCountChart_getPaymentsStatistic(
    $dateFrom: String
    $dateTo: String
    $detalization: DetalizationEnum
    $paymentStatus: String
    $paymentType: String
    $additionalStatistics: [AdditionalStatisticInput]
  ) {
    statistics {
      payments(
        dateFrom: $dateFrom
        dateTo: $dateTo
        detalization: $detalization
        paymentStatus: $paymentStatus
        paymentType: $paymentType
        additionalStatistics: $additionalStatistics
      ) {
        error {
          error
        }
        data {
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
