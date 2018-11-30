import gql from 'graphql-tag';

const registeredUsersQuery = gql`
  query getRegUsersStat(
    $registrationDateFrom: String!,
    $registrationDateTo: String!,
    $clientIds: [String],
  ) {
    statistics {
      registrations(
        registrationDateFrom: $registrationDateFrom,
        registrationDateTo: $registrationDateTo,
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
        count
        error
      }
      month {
        count
        error
      }
      total {
        count
        error
      }
    }
  }
}`;

const paymentsStatisticQuery = gql`
  query getDepositsStat(
    $dateFrom: String!,
    $dateTo: String!
  ) {
    statistics {
      payments(
        dateFrom: $dateFrom,
        dateTo: $dateTo,
      ) {
        error {
          error
        }
        data {
          items {
            deposits {
              amount
              count
              entryDate
            }
            withdraws {
              amount
              count
              entryDate
            }
          }
          totalDepositsAmount
          totalDepositsCount
          totalWithdrawsAmount
          totalWithdrawsCount
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
