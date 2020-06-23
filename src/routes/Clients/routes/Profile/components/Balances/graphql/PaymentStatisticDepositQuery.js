import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { tradingStatuses, tradingTypes } from 'constants/payment';
import { initialQueryParams } from './constants';

const REQUEST = gql`
  query PaymentStatisticDepositQuery_Balances(
    $dateFrom: String,
    $dateTo: String,
    $detalization: DetalizationEnum,
    $paymentStatus: String,
    $paymentType: String,
    $profileId: String,
    $additionalStatistics: [AdditionalStatisticInput]
  ) {
    statistics {
      payments(
        dateFrom: $dateFrom,
        dateTo: $dateTo,
        detalization: $detalization,
        paymentStatus: $paymentStatus,
        paymentType: $paymentType,
        profileId: $profileId
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

const PaymentStatisticDepositQuery = ({ uuid: profileId, clientRegistrationDate, children }) => (
  <Query
    query={REQUEST}
    variables={{
      profileId,
      ...initialQueryParams(tradingTypes.DEPOSIT, tradingStatuses.COMPLETED, clientRegistrationDate),
    }}
  >
    {children}
  </Query>
);

PaymentStatisticDepositQuery.propTypes = {
  children: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
  clientRegistrationDate: PropTypes.string.isRequired,
};

export default PaymentStatisticDepositQuery;
