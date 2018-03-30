import gql from 'graphql-tag';

const profileQuery = gql`query profileData($playerUUID: String!){
  playerProfile(playerUUID: $playerUUID) {
    data {
      accumulated {
        baseCurrencyDeposits {
          amount
          currency
        }
        baseCurrencyWithdraws {
          amount
          currency
        }
        walletCurrencyDeposits {
          amount
          currency
        }
        walletCurrencyWithdraws {
          amount
          currency
        }
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
      lastName
      email
      registrationDate
      affiliateId
      profileStatusReason
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
        brandId
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
  realBaseCurrencyQuery,
};

