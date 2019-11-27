import gql from 'graphql-tag';
import queryNames from 'constants/apolloQueryNames';

const newProfile = gql`query newProfile($playerUUID: String!){
  newProfile(playerUUID: $playerUUID) {
    data {
      age
      birthDate
      brandId
      clientType
      convertedFromLeadUuid
      firstName
      gender
      identificationNumber
      languageCode
      lastUpdatedBy
      lastUpdatedDate
      lastName
      migrationId
      uuid
      emailVerified
      phoneVerified
      profileVerified
      acquisition {
        acquisitionStatus
        retentionRepresentative
        retentionStatus
        retentionOperator {
          fullName
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
        salesRepresentative
        salesStatus
        salesOperator {
          fullName
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
      },
      address {
        address
        city
        countryCode
        postCode
        state
      }
      affiliate {
        externalId
        firstName
        referral
        sms
        source
        uuid
      }
      bankDetails {
        accountHolderName
        accountNumber
        branchName
        city
        name
        province
        swiftCode
        withdrawalArea
      }
      configuration {
        crs
        fatca
        internalTransfer
        gdpr {
          sms
          email
          phone
          socialMedia
        }
        subscription {
          marketNews
          information
          educational
          promosAndOffers
          statisticsAndSummary
        }
        webCookies {
          enabled
        }
      }
      contacts {
        additionalEmail
        additionalPhone
        email
        phone
      }
      passport {
        countryOfIssue
        countrySpecificIdentifier
        countrySpecificIdentifierType
        expirationDate
        issueDate
        number
      }
      kyc {
        status
      }
      registrationDetails {
        deviceDetails {
          deviceType
          operatingSystem
        }
        inetDetails {
          host
          ipAddress
          referer
        }
        locationDetails {
          city
          countryCode
          region
        }
        registeredBy
        registrationDate
        userAgent
      }
      status {
        changedAt
        changedBy
        comment
        reason
        type
      }
      profileView {
        balance {
          amount
          credit
        }
        lastSignInSessions {
          ip
          countryCode
        }
      }
      tradingAccount {
        currency
        balance
        credit
        margin
      }
    }
    error {
      error
    }
  }
}`;

const clientsQuery = gql`query ${queryNames.clientsQuery}(
  $args: ClientSearchParams
) {
  profiles(
    args: $args
  ) {
      error {
        error
      }
      data {
        page
        number
        totalElements
        totalPages
        size
        last
        content {
          acquisition {
            acquisitionStatus
            retentionStatus
            retentionRepresentative
            retentionOperator {
              fullName
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
            salesRepresentative
            salesOperator {
              fullName
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
          }
          address {
            countryCode
          }
          affiliate {
            firstName
            source
            uuid
          }
          balance {
            amount
          }
          firstName
          languageCode
          lastName
          lastNote {
            changedAt
            content
            uuid
          }
          paymentDetails {
            depositsCount
            lastDepositTime
          }
          status {
            changedAt
            type
          }
          uuid
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
  getLoginLock,
  newProfile,
};
