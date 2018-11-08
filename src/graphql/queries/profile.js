import gql from 'graphql-tag';

const profileQuery = gql`query profileData($playerUUID: String!){
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
      phone2
      phoneCode2
      age
      profileVerified
      currency
      weight
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
  $balanceFrom: Float,
  $balanceTo: Float,
  $countries: [String],
  $registrationDateFrom: String,
  $registrationDateTo: String,
  $searchValue: String,
  $status: String,
  $hierarchyUsers: [String],
  $repIds: [String],
) {
  profiles(
    page: $page,
    size: $size,
    acquisitionStatus: $acquisitionStatus,
    tradingBalanceFrom: $balanceFrom,
    tradingBalanceTo: $balanceTo,
    countries: $countries,
    registrationDateFrom: $registrationDateFrom,
    registrationDateTo: $registrationDateTo,
    searchValue: $searchValue,
    status: $status,
    hierarchyUsers: $hierarchyUsers,
    repIds: $repIds,
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
      intendedAmountToSpend
      temporaryUntil
    }
    error {
      error
    }
  }
}`;

const locksQuery = gql`query locksQuery($playerUUID: String!){
  playerProfileLocks(playerUUID: $playerUUID) {
    payment {
      type
      author
      canUnlock
      authorUUID
      id
      playerUUID
      reason
      startLock
    }
    login {
      locked
      expirationDate
      reason
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
  profileQuery,
  locksQuery,
  realBaseCurrencyQuery,
  clientPaymentsStatistic,
  clientsQuery,
  clientQuery,
};

