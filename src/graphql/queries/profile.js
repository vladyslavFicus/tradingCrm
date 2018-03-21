
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
      currency
      firstName
      username
      languageCode
      lastName
      registrationDate
      profileStatusReason
      profileStatus
      gender
      playerUUID
      btag
      birthDate
      marketingMail
      marketingNews
      marketingSMS
      locks {
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

export {
  profileQuery,
};

