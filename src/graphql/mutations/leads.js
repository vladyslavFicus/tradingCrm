import gql from 'graphql-tag';

const updateLeadProfile = gql`mutation updateLead(
  $uuid: String!,
  $name: String,
  $surname: String,
  $phone: String,
  $mobile: String,
  $email: String,
  $country: String,
  $birthDate: String,
  $gender: String,
  $city: String,
) {
  leads {
    update (
      uuid: $uuid,
      name: $name,
      surname: $surname,
      phone: $phone,
      mobile: $mobile,
      email: $email,
      country: $country,
      birthDate: $birthDate,
      gender: $gender,
      city: $city,
    ) {
      data {
        _id
        uuid
        name
        surname
        phone
        mobile
        email
        country
        birthDate
        gender
        city
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const promoteLeadToClient = gql`mutation promoteLead(
  $password: String!,
  $email: String!,
  $firstName: String!,
  $lastName: String!,
  $country: String!,
  $currency: String!,
  $city: String,
  $gender: String,
  $birthDate: String,
  $phone1: String!,
  $phone2: String,
  $languageCode: String!,
  $leadUuid: String!
) {
  leads {
    promote (
      password: $password,
      email: $email,
      firstName: $firstName,
      lastName: $lastName,
      country: $country,
      currency: $currency,
      city: $city,
      gender: $gender,
      birthDate: $birthDate,
      phone1: $phone1,
      phone2: $phone2,
      languageCode: $languageCode,
      leadUuid: $leadUuid,
    ) {
      data {
        playerUUID
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const bulkLeadPromote = gql`mutation promoteToClient(
  $allRecords: Boolean,
  $leadIds: [String],
  $countries: [String],
  $searchKeyword: String,
  $registrationDateEnd: String,
  $registrationDateStart: String,
  $salesStatus: tradingProfileSalesStatus,
  $totalRecords: Int,
) {
  leads {
    bulkPromote (
      allRecords: $allRecords,
      leadIds: $leadIds,
      countries: $countries,
      searchKeyword: $searchKeyword,
      registrationDateEnd: $registrationDateEnd,
      registrationDateStart: $registrationDateStart,
      salesStatus: $salesStatus,
      totalRecords: $totalRecords,
    ) {
      data
      error {
        error
        fields_errors
      }
      errors {
        error
        fields_errors
      }
    }
  }
}`;

const bulkLeadUpdate = gql`mutation bulkLeadUpdate(
  $teamId: String,
  $salesRep: [String],
  $salesStatus: String,
  $type: String!,
  $allRowsSelected: Boolean,
  $leads: [LeadBulkUpdateType],
  $totalElements: Int,
  $searchParams: LeadSearchParams,
) {
  leads {
    bulkLeadUpdate (
      teamId: $teamId,
      salesRep: $salesRep
      salesStatus: $salesStatus,
      type: $type,
      allRowsSelected: $allRowsSelected,
      leads: $leads,
      totalElements: $totalElements,
      searchParams: $searchParams,
    ) {
      data
      error {
        error
        fields_errors
      }
      errors {
        error
        fields_errors
      }
    }
  }
}`;

export {
  updateLeadProfile,
  promoteLeadToClient,
  bulkLeadPromote,
  bulkLeadUpdate,
};
