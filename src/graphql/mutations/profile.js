import gql from 'graphql-tag';
import { ContactsFragment } from '../fragments/contacts';
import { AddressFragment } from '../fragments/address';
import { ProfileStatusFragment } from '../fragments/profileStatus';

const updateSubscription = gql`mutation updateSubscription(
    $playerUUID: String!,
    $marketingMail: Boolean!,
    $marketingSMS: Boolean!,
    $tailorMadeEmail: Boolean!,
    $tailorMadeSMS: Boolean!
) {
  profile {
    updateSubscription(
      playerUUID: $playerUUID,
      marketingSMS: $marketingSMS,
      marketingMail: $marketingMail,
      tailorMadeEmail: $tailorMadeEmail,
      tailorMadeSMS: $tailorMadeSMS
      ) {
      data {
        playerUUID
        marketingMail
        marketingSMS
        tailorMadeEmail
        tailorMadeSMS
      }
      error {
        error
      }
    }
  }
}`;

const changeProfileStatusMutation = gql`mutation changeProfileStatus(
  $playerUUID: String!,
  $reason: String!,
  $comment: String,
  $status: String!,
) {
  profile {
    changeProfileStatus(
      playerUUID: $playerUUID,
      reason: $reason,
      comment: $comment,
      status: $status,
      ) {
      data {
        _id
        status {
          ...ProfileStatusFragment
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
}
${ProfileStatusFragment}`;

const passwordResetRequest = gql`mutation passwordResetRequest($playerUUID: String!) {
  profile {
    passwordResetRequest(playerUUID: $playerUUID) {
      success
    }
  }
}`;

const changePassword = gql`mutation changePassword($playerUUID: String!, $password: String!) {
  profile {
    changePassword(playerUUID: $playerUUID, password: $password) {
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

const updateContactsMutation = gql`mutation updateContacts(
  $playerUUID: String!,
  $phone: String,
  $additionalPhone: String,
  $additionalEmail: String,
  $email: String,
) {
  profile {
    updateContacts(
      additionalPhone: $additionalPhone,
      additionalEmail: $additionalEmail,
      playerUUID: $playerUUID,
      phone: $phone,
      email: $email,
    ) {
      data {
        _id
        phoneVerified
        contacts {
          ...ContactsFragment
        }
      }
      error {
        error
      }
    }
  }
}
${ContactsFragment}`;

const updateAddressMutation = gql`mutation updateAddress(
  $playerUUID: String!,
  $countryCode: String,
  $city: String,
  $state: String,
  $postCode: String,
  $address: String,
) {
  profile {
    updateAddress(
      playerUUID: $playerUUID,
      countryCode: $countryCode,
      city: $city,
      state: $state,
      postCode: $postCode,
      address: $address,
    ) {
      data {
        _id
        address {
          ...AddressFragment
        } 
      }
    }
  }
}
${AddressFragment}`;

const verifyPhoneMutation = gql`mutation verifyPhone(
  $playerUUID: String!,
  $phone: String,
) {
  profile {
    verifyPhone(
      playerUUID: $playerUUID,
      phone: $phone,
    ) {
      data {
        _id
        phoneVerified  
      }
      error {
        error
      }
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
  updateSubscription,
  passwordResetRequest,
  changePassword,
  clientsBulkRepresentativeUpdate,
  updateMutation,
  clickToCall,
  updateLimitProfileMutation,
  updatePersonalInformationMutation,
  updateConfigurationMutation,
  updateContactsMutation,
  verifyPhoneMutation,
  verifyEmailMutation,
  updateAddressMutation,
  changeProfileStatusMutation,
  updateEmailMutation,
};
