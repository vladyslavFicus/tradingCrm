import gql from 'graphql-tag';
import { AddressFragment } from '../fragments/address';

const clientsBulkRepresentativeUpdate = gql`mutation bulkRepresentativeUpdate(
  $salesRepresentative: [String]
  $retentionRepresentative: [String]
  $salesStatus: String
  $retentionStatus: String
  $type: String!
  $isMoveAction: Boolean
  $allRowsSelected: Boolean
  $clients: [ClientUpdate__Input]
  $totalElements: Int
  $searchParams: ClientSearch__Input
) {
  profile {
    bulkClientUpdate (
      salesRepresentative: $salesRepresentative
      retentionRepresentative: $retentionRepresentative
      salesStatus: $salesStatus
      retentionStatus: $retentionStatus
      type: $type
      isMoveAction: $isMoveAction
      allRowsSelected: $allRowsSelected
      clients: $clients
      totalElements: $totalElements
      searchParams: $searchParams
    )
  }
}`;

const clickToCall = gql`mutation clickToCall($number: String!) {
  clickToCall {
    didlogic {
      createCall(number: $number)
    }
  }
}`;

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

const updateAddressMutation = gql`mutation updateAddress(
  $playerUUID: String!
  $countryCode: String
  $city: String
  $state: String
  $postCode: String
  $poBox: String
  $address: String
) {
  profile {
    updateAddress(
      playerUUID: $playerUUID
      countryCode: $countryCode
      city: $city
      state: $state
      postCode: $postCode
      poBox: $poBox
      address: $address
    ) {
      _id
      address {
        ...AddressFragment
      }
    }
  }
}
${AddressFragment}`;

const verifyEmailMutation = gql`mutation verifyEmail($playerUUID: String!) {
  profile {
    verifyEmail(playerUUID: $playerUUID) {
      _id
      emailVerified
    }
  }
}`;

export {
  clientsBulkRepresentativeUpdate,
  clickToCall,
  updatePersonalInformationMutation,
  updateConfigurationMutation,
  verifyEmailMutation,
  updateAddressMutation,
  updateEmailMutation,
};
