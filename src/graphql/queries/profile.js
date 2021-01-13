import gql from 'graphql-tag';
import { ContactsFragment } from '../fragments/contacts';
import { AddressFragment } from '../fragments/address';

// # Remove after Client top bar will be refactored
const profile = gql`query profile(
  $playerUUID: String!
){
  profile(
    playerUUID: $playerUUID
  ) {
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
    tradingAccounts {
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
    # uncomment when email history will be rdy
    # sentEmails {
    #   id
    #   name
    #   subject
    #   text
    # }
  }
}
${ContactsFragment}
${AddressFragment}
`;

export {
  profile,
};
