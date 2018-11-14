import gql from 'graphql-tag';

const updateLeadProfile = gql`mutation updateLead(
  $id: String!,
  $brandId: String!,
  $name: String!,
  $surname: String!,
  $phoneCode: String!,
  $phoneNumber: String,
  $phone: String!,
  $mobileCode: String!,
  $mobileNumber: String,
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
      brandId: $brandId,
      name: $name,
      surname: $surname,
      phoneCode: $phoneCode,
      phoneNumber: $phoneNumber,
      phone: $phone,
      mobileCode: $mobileCode,
      mobileNumber: $mobileNumber,
      mobile: $mobile,
      email: $email,
      country: $country,
      birthDate: $birthDate,
      gender: $gender,
      city: $city,
    ) {
      data
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
  $brandId: String!,
  $city: String!,
  $phoneCode: String!,
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
      brandId: $brandId,
      city: $city,
      phoneCode: $phoneCode,
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
  $queryIds: [String],
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
      queryIds: $queryIds,
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
};
