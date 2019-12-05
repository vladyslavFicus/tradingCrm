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
  $args: CreateProfileInputType
) {
  leads {
    promote (
      args: $args
    ) {
      data {
        uuid
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
  $salesRepresentative: [String],
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
      salesRep: $salesRepresentative
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
