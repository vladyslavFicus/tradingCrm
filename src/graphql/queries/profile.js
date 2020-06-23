import gql from 'graphql-tag';
import queryNames from 'constants/apolloQueryNames';
import { ContactsFragment } from '../fragments/contacts';
import { AddressFragment } from '../fragments/address';

const profile = gql`query profile($playerUUID: String!){
  profile(playerUUID: $playerUUID) {
    data {
      _id
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
      timeZone
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
        ...AddressFragment
      }
      affiliate {
        uuid
        externalId
        referral
        sms
        source
        campaignId
        partner {
          fullName
        }
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
        ...ContactsFragment
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
        uuid
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
          startedAt
        }
        lastActivity {
          date
        }
      }
      tradingAccount {
        accountUUID
        accountType
        archived
        balance
        credit
        currency
        group
        login
        margin
        name
        platformType
      }
#      uncomment when email history will be rdy
#      sentEmails {
#        id
#        name
#        subject
#        text
#      }
    }
    error {
      error
    }
  }
}
${ContactsFragment}
${AddressFragment}
`;

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
            uuid
            source
            campaignId
            partner {
              fullName
            }
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
            operator {
              fullName
            }
          }
          paymentDetails {
            depositsCount
            lastDepositTime
          }
          registrationDetails {
            registrationDate
          }
          status {
            changedAt
            type
          }
          uuid
          lastActivity {
            date
          }
          warnings
        }
      }
    }
}`;

const getLoginLock = gql`query getLoginLock($uuid: String!) {
  loginLock(uuid: $uuid) {
    lock
  }
}`;

export {
  clientsQuery,
  getLoginLock,
  profile,
};
