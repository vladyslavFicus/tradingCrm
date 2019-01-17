import gql from 'graphql-tag';

const clientQuery = gql`query profileData($playerUUID: String!){
  playerProfile(playerUUID: $playerUUID) {
    data {
      accumulatedDeposits {
        amount
        currency
      }
      accumulatedWithdrawals {
        amount
        currency
      }
      playerUUID
      realMoneyBalance {
        amount
        currency
      }
      bonusBalance {
        amount
        currency
      }
      withdrawableAmount {
        amount
        currency
      }
      totalBalance {
        amount
        currency
      }
      age
      profileVerified
      currency
      firstName
      username
      languageCode
      city
      phoneNumber
      phoneNumberVerified
      lastName
      email
      registrationDate
      affiliateId
      suspendEndDate
      profileStatusAuthor
      profileStatusComment
      profileStatusPermanent
      profileStatusReason
      profileStatusDate
      profileStatus
      gender
      playerUUID
      btag
      birthDate
      marketingMail
      marketingSMS
      tailorMadeEmail
      tailorMadeSMS
      device {
        lastSignInCountryCode
        lastSignInIP
        lastSignInDate
        hash
        totalSignIn
      }
      signInIps {
        country
        sessionStart
        browserAgent
        ip
        sessionId
        uuid
      }
      isTest
      registrationDate
      tradingProfile {
        phone1
        phone2
        margin
        marginLevel
        isTestUser
        aquisitionRep {
          fullName
          uuid
        }
        aquisitionStatus
        kycRep {
          fullName
          uuid
        }
        kycStatus
        salesRep {
          fullName
          uuid
        }
        salesStatus
        retentionRep {
          fullName
          uuid
        }
        retentionStatus
        balance
        credit
        equity
        baseCurrencyEquity
        baseCurrencyBalance
        mt4Users {
          login
          balance
          equity
          symbol
          leverage
          name
          group
          margin
          createdBy
          credit
        }
        firstDepositDate
        lastDepositDate
        firstWithdrawalDate
        lastWithdrawalDate
        depositCount
        withdrawalCount
        languageCode
      }
      intendedAmountToSpend
      temporaryUntil
    }
    error {
      error
    }
  }
}`;

const clientsQuery = gql`query getProfiles(
  $page: Int,
  $size: Int,
  $acquisitionStatus: String,
  $countries: [String],
  $tradingBalanceFrom: String,
  $tradingBalanceTo: String,
  $registrationDateFrom: String,
  $registrationDateTo: String,
  $searchValue: String,
  $status: String,
  $repIds: [String],
  $assignStatus: String,
  $kycStatus: String,
  $firstDeposit: String,
  $salesStatuses: [String],
  $retentionStatuses: [String]
) {
  profiles(
    page: $page,
    size: $size,
    acquisitionStatus: $acquisitionStatus,
    tradingBalanceFrom: $tradingBalanceFrom,
    tradingBalanceTo: $tradingBalanceTo,
    countries: $countries,
    registrationDateFrom: $registrationDateFrom,
    registrationDateTo: $registrationDateTo,
    searchValue: $searchValue,
    status: $status,
    repIds: $repIds,
    assignStatus: $assignStatus,
    kycStatus: $kycStatus
    firstDeposit: $firstDeposit
    salesStatuses: $salesStatuses
    retentionStatuses: $retentionStatuses
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
          registrationDate
          tradingProfile {
            isTestUser
            aquisitionRep {
              fullName
              uuid
            }
            aquisitionStatus
            kycRep {
              fullName
              uuid
            }
            kycStatus
            salesRep {
              fullName
              uuid
              hierarchy {
                parentBranches {
                  name
                  branchType
                  parentBranch {
                    name
                    branchType
                  }
                }
              }
            }
            salesStatus
            retentionRep {
              fullName
              uuid
              hierarchy {
                parentBranches {
                  name
                  branchType
                  parentBranch {
                    name
                    branchType
                  }
                }
              }
            }
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
              name
              margin
              createdBy
              credit
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

const realBaseCurrencyQuery = gql`query profileData($playerUUID: String!){
  playerProfile(playerUUID: $playerUUID) {
    data {
      realMoneyBalance {
        currency
      }
    }
    error {
      error
    }
  }
}`;

const clientPaymentsStatistic = gql`query clientPaymentsStatistic(
  $limit: Int,
  $playerUUID: String!,
  $startDate: String,
  $endDate: String,
) {
  clientPaymentsStatistic(
    limit: $limit,
    playerUUID: $playerUUID,
    startDate: $startDate,
    endDate: $endDate,
  ) {
    depositCount
    depositAmount {
      amount
      currency
    }
    withdrawCount
    withdrawAmount {
      amount
      currency
    }
  }
}`;

export {
  realBaseCurrencyQuery,
  clientPaymentsStatistic,
  clientsQuery,
  clientQuery,
};

