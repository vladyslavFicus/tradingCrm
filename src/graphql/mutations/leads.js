import gql from 'graphql-tag';

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
  $nameOrEmailOrId: String,
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
      nameOrEmailOrId: $nameOrEmailOrId,
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
  promoteLeadToClient,
  bulkLeadPromote,
};
