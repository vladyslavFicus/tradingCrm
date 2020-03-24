import gql from 'graphql-tag';

const paymentsStatisticQuery = gql`
  query getPaymentsStat(
    $dateFrom: String,
    $dateTo: String,
    $detalization: DetalizationEnum,
    $paymentStatus: String,
    $paymentType: String,
    $playerUUID: String,
    $additionalStatistics: [AdditionalStatisticInput]
  ) {
    statistics {
      payments(
        dateFrom: $dateFrom,
        dateTo: $dateTo,
        detalization: $detalization,
        paymentStatus: $paymentStatus,
        paymentType: $paymentType,
        playerUUID: $playerUUID
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

export {
  paymentsStatisticQuery,
};
