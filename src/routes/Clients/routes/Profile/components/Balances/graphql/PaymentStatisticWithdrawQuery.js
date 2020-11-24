import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { tradingStatuses, tradingTypes } from 'constants/payment';
import { initialQueryParams } from './constants';

const REQUEST = gql`
  query PaymentStatisticWithdrawQuery_Balances(
    $dateFrom: String,
    $dateTo: String,
    $detalization: StatisticDetalization__Enum,
    $paymentStatus: String,
    $paymentType: String,
    $profileId: String,
    $additionalStatistics: [PaymentStatisticDateRange__Input]
  ) {
    paymentsStatistic(
      dateFrom: $dateFrom,
      dateTo: $dateTo,
      detalization: $detalization,
      paymentStatus: $paymentStatus,
      paymentType: $paymentType,
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

const PaymentStatisticWithdrawQuery = ({ uuid: profileId, clientRegistrationDate, children }) => (
  <Query
    query={REQUEST}
    variables={{
      profileId,
      ...initialQueryParams(tradingTypes.WITHDRAW, tradingStatuses.COMPLETED, clientRegistrationDate),
    }}
  >
    {children}
  </Query>
);

PaymentStatisticWithdrawQuery.propTypes = {
  children: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
  clientRegistrationDate: PropTypes.string.isRequired,
};

export default PaymentStatisticWithdrawQuery;
