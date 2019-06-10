import gql from 'graphql-tag';
import queryNames from 'constants/apolloQueryNames';

const clientQuery = gql`query profileData($playerUUID: String!){
  playerProfile(playerUUID: $playerUUID) {
    data {
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
        passport {
          passportNumber
          passportIssueDate
          expirationDate
          countryOfIssue
        }
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
        clientType
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
        affiliateProfileDocument {
          _id
          source
          referral
          affiliate {
            fullName
          }
        }
        convertedFromLeadUuid
        migrationId
        fnsStatus
        fatca {
          provided
        }
      }
      intendedAmountToSpend
      temporaryUntil
    }
    error {
      error
    }
  }
}`;

const clientsQuery = gql`query ${queryNames.clientsQuery}(
  $page: Int,
  $size: Int,
  $acquisitionStatus: String,
  $countries: [String],
  $tradingBalanceFrom: Float,
  $tradingBalanceTo: Float,
  $registrationDateFrom: String,
  $registrationDateTo: String,
  $searchValue: String,
  $status: String,
  $repIds: [String],
  $assignStatus: String,
  $kycStatus: String,
  $firstDeposit: String,
  $salesStatuses: [String],
  $retentionStatuses: [String],
  $searchAffiliate: String,
  $searchMigrationId: String,
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
    searchAffiliate: $searchAffiliate
    searchMigrationId: $searchMigrationId
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
            affiliateProfileDocument {
              _id
              source
              affiliate {
                fullName
              }
            }
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

const realBaseCurrencyQuery = gql`query realBaseCurrency($playerUUID: String!){
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

const getLoginLock = gql`query getLoginLock($playerUUID: String!) {
  loginLock(playerUUID: $playerUUID) {
    lock
  }
}`;

export {
  realBaseCurrencyQuery,
  clientPaymentsStatistic,
  clientsQuery,
  clientQuery,
  getLoginLock,
};

