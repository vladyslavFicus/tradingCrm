import gql from 'graphql-tag';

const registeredUsersQuery = gql`
  query getRegUsersStat($registrationDateFrom: String!, $registrationDateTo: String!) {
    statistics {
      registrations(registrationDateFrom: $registrationDateFrom, registrationDateTo: $registrationDateTo) {
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

const paymentsStatisticQuery = gql`
  query getDepositsStat($dateFrom: String!, $dateTo: String!) {
    statistics {
      payments(dateFrom: $dateFrom, dateTo: $dateTo) {
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

export { registeredUsersQuery, paymentsStatisticQuery };
