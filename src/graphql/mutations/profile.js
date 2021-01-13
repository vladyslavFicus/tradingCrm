import gql from 'graphql-tag';

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
  verifyEmailMutation,
  updateEmailMutation,
};
