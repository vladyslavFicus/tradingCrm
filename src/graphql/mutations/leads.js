import gql from 'graphql-tag';

const updateLeadProfile = gql`mutation updateLead(
  $id: String!,
  $name: String!,
  $surname: String!,
  $phone: String!,
  $mobile: String!,
  $email: String,
  $country: String,
  $birthDate: String,
  $gender: String,
  $city: String,
) {
  leads {
    update (
      id: $id,
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
        id
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
  $city: String,
  $phone: String!,
  $languageCode: String!,
) {
  leads {
    promote (
      password: $password,
      email: $email,
      firstName: $firstName,
      lastName: $lastName,
      country: $country,
      city: $city,
      phone: $phone,
      languageCode: $languageCode,
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
  $salesRep: String
  $salesStatus: String,
  $type: String!,
  $allRowsSelected: Boolean,
  $ids: [String],
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
      ids: $ids,
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
