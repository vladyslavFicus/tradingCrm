import gql from 'graphql-tag';

const registeredUsersQuery = gql`
  query getRegUsersStat(
    $dateFrom: String!,
    $dateTo: String!,
    $clientIds: [String],
  ) {
    statistics {
      registrations(
        registrationDateFrom: $dateFrom,
        registrationDateTo: $dateTo,
        clientIds: $clientIds,
      ) {
        error {
          error
        }
        data {
          items {
            entries
            entryDate
          }
          total
        }
      }
    }
  }
`;

const registeredUsersTotalsQuery = gql`query getRegUsersStat($timezone: Int!) {
  statistics {
    registrationTotals(timezone: $timezone) {
      today {
        value
        error
      }
      month {
        value
        error
      }
      total {
        value
        error
      }
    }
  }
}`;

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
  registeredUsersQuery,
  paymentsStatisticQuery,
  registeredUsersTotalsQuery,
};
