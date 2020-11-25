import { gql } from '@apollo/client';

const updatePersonalInformationMutation = gql`mutation updatePersonalInformation(
  $playerUUID: String!
  $firstName: String
  $lastName: String
  $languageCode: String
  $gender: String
  $birthDate: String
  $passport: Passport__Input
  $identificationNumber: String
  $timeZone: String
) {
  profile {
    updatePersonalInformation(
      playerUUID: $playerUUID
      firstName: $firstName
      lastName: $lastName
      languageCode: $languageCode
      gender: $gender
      birthDate: $birthDate
      passport: $passport
      identificationNumber: $identificationNumber
      timeZone: $timeZone
    ) {
      _id
      firstName
      lastName
      birthDate
      languageCode
      gender
      identificationNumber
      timeZone
      passport {
        countryOfIssue
        countrySpecificIdentifier
        countrySpecificIdentifierType
        expirationDate
        issueDate
        number
      }
    }
  }
}`;

const updateEmailMutation = gql`mutation updateEmail(
  $playerUUID: String!,
  $email: String,
) {
  profile {
    updateEmail(
      playerUUID: $playerUUID,
      email: $email,
    ) {
      _id
      contacts {
        email
      }
    }
  }
}`;

const updateConfigurationMutation = gql`mutation updateConfiguration(
  $playerUUID: String!,
  $internalTransfer: Boolean,
  $crs: Boolean,
  $fatca: Boolean,
) {
  profile {
    updateConfiguration(
      playerUUID: $playerUUID,
      internalTransfer: $internalTransfer,
      crs: $crs,
      fatca: $fatca,
    )
  }
}`;

const verifyEmailMutation = gql`mutation verifyEmail($playerUUID: String!) {
  profile {
    verifyEmail(playerUUID: $playerUUID) {
      _id
      emailVerified
    }
  }
}`;

export {
  updatePersonalInformationMutation,
  updateConfigurationMutation,
  verifyEmailMutation,
  updateEmailMutation,
};
