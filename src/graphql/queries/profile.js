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
      marketingNews
      marketingSMS
      tags {
        id
        priority
        tag
      }
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
      registrationDate
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

export {
  profileQuery,
  locksQuery,
  realBaseCurrencyQuery,
};

