import gql from 'graphql-tag';

const paymentsStatisticQuery = gql`
  query getPaymentsStat(
    $dateFrom: String
    $dateTo: String
    $detalization: StatisticDetalization__Enum
    $paymentStatus: String
    $paymentType: String
    $profileId: String
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

export {
  paymentsStatisticQuery,
};
