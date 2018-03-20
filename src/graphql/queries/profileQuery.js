
import gql from 'graphql-tag';

const profileQuery = gql`query profileData($playerUUID: String!){
  playerProfile(playerUUID: $playerUUID) {
    data {
      playerUUID
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
        }
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

