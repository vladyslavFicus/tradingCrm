import gql from 'graphql-tag';

const clientsQuery = gql`query getClients(
  $page: Int,
  $size: Int,
  $acquisitionStatus: String,
  $balanceFrom: Float,
  $balanceTo: Float,
  $countries: [String],
  $registrationDateFrom: String,
  $registrationDateTo: String,
  $searchValue: String,
  $status: String,
) {
  clients(
    page: $page,
    size: $size,
    acquisitionStatus: $acquisitionStatus,
    balanceFrom: $balanceFrom,
    balanceTo: $balanceTo,
    countries: $countries,
    registrationDateFrom: $registrationDateFrom,
    registrationDateTo: $registrationDateTo,
    searchValue: $searchValue,
    status: $status,
    ) {
      error {
        error
      }
      data {
        page
        number
        totalElements
        size
        last
        content {
          playerUUID
          kycCompleted
          age
          firstName
          lastName
          currency
          country
          affiliateId
          username
          languageCode
          profileStatus
          profileStatusDate
          tradingProfile {
            isTestUser
            aquisitionRep
            aquisitionStatus
            kycRep
            kycStatus
            salesRep
            salesStatus
            retentionRep
            retentionStatus
            balance
            equity
            baseCurrencyEquity
            baseCurrencyBalance
            mt4Users {
              login
              balance
              equity
              symbol
            }
            firstDepositDate
            lastDepositDate
            firstWithdrawalDate
            lastWithdrawalDate
            depositCount
            withdrawalCount
          }
          signInIps {
            country
            sessionStart
            browserAgent
            ip
            sessionId
            uuid
          }
        }
      }
    }
}`;

export { clientsQuery };
