import gql from 'graphql-tag';

const passwordResetRequest = gql`mutation passwordResetRequest($playerUUID: String!) {
  profile {
    passwordResetRequest(
      userUuid: $playerUUID
    ) {
      success
    }
  }
}`;

const changePassword = gql`mutation changePassword($playerUUID: String!, $password: String!) {
  profile {
    changePassword(
      clientUuid: $playerUUID
      newPassword: $password
    ) {
      success
    }
  }
}`;

const clientsBulkRepresentativeUpdate = gql`mutation bulkRepresentativeUpdate(
  $teamId: String,
  $salesRepresentative: [String],
  $retentionRepresentative: [String],
  $salesStatus: String,
  $retentionStatus: String,
  $type: String!,
  $isMoveAction: Boolean,
  $allRowsSelected: Boolean,
  $clients: [ClientBulkUpdateType],
  $totalElements: Int,
  $searchParams: ClientSearchParams,
) {
  clients {
    bulkRepresentativeUpdate (
      teamId: $teamId,
      salesRepresentative: $salesRepresentative
      retentionRepresentative: $retentionRepresentative,
      salesStatus: $salesStatus,
      retentionStatus: $retentionStatus,
      type: $type,
      isMoveAction: $isMoveAction,
      allRowsSelected: $allRowsSelected,
      clients: $clients,
      totalElements: $totalElements,
      searchParams: $searchParams,
    ) {
      data
      error {
        error
        fields_errors
      }
    }
  }
}`;

const updateMutation = gql`mutation update(
  $playerUUID: String!,
  $phone1: String,
  $phone2: String,
  $languageCode: String,
  $passportNumber: String,
  $expirationDate: String,
  $countryOfIssue: String,
  $passportIssueDate: String,
  $kycStatus: String,
  $countrySpecificIdentifier: String,
  $countrySpecificIdentifierType: String,
  $enableInternalTransfer: Boolean,
){
  profile {
    update(
      playerUUID: $playerUUID,
      phone1: $phone1,
      phone2: $phone2,
      languageCode: $languageCode,
      passportNumber: $passportNumber,
      expirationDate: $expirationDate,
      countryOfIssue: $countryOfIssue,
      passportIssueDate: $passportIssueDate,
      kycStatus: $kycStatus,
      countrySpecificIdentifier: $countrySpecificIdentifier,
      countrySpecificIdentifierType: $countrySpecificIdentifierType,
      enableInternalTransfer: $enableInternalTransfer,
    ) {
      data {
        playerUUID
        tradingProfile {
          phone1
          phone2
          languageCode
          kycStatus
          passport {
            passportNumber
            expirationDate
            countryOfIssue
            passportIssueDate
          }
          countrySpecificIdentifier
          countrySpecificIdentifierType
          enableInternalTransfer
        }
      }
      error {
        error
      }
    }
  }
}`;

const updateLimitProfileMutation = gql`mutation update(
  $profileId: String!,
  $phone2: String,
  $email2: String
){
  profile {
    limitedUpdate(
      profileId: $profileId,
      phone2: $phone2,
      email2: $email2
    ) {
      success,
    }
  }
}`;

const clickToCall = gql`mutation clickToCall($number: String!) {
  profile {
    clickToCall(number: $number) {
      success
    }
  }
}`;

const updatePersonalInformationMutation = gql`mutation updatePersonalInformation(
  $playerUUID: String!,
  $firstName: String,
  $lastName: String,
  $languageCode: String,
  $gender: String,
  $birthDate: String,
  $passport: PassportInput,
  $identificationNumber: String,
  $timeZone: String,
) {
  profile {
    updatePersonalInformation(
      playerUUID: $playerUUID,
      firstName: $firstName,
      lastName: $lastName,
      languageCode: $languageCode,
      gender: $gender,
      birthDate: $birthDate,
      passport: $passport,
      identificationNumber: $identificationNumber,
      timeZone: $timeZone,
    ) {
      data {
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
      error {
        error
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
      error {
        error,
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
    ) {
      success
    }
  }
}`;

const verifyEmailMutation = gql`mutation verifyEmail($playerUUID: String!) {
  profile {
    verifyEmail(playerUUID: $playerUUID) {
      data {
        _id
        emailVerified
      }
      error {
        error
      }
    }
  }
}`;

export {
  passwordResetRequest,
  changePassword,
  clientsBulkRepresentativeUpdate,
  updateMutation,
  clickToCall,
  updateLimitProfileMutation,
  updatePersonalInformationMutation,
  updateConfigurationMutation,
  verifyEmailMutation,
  updateEmailMutation,
};
