import gql from 'graphql-tag';

const promoteLeadToClient = gql`mutation promoteToClient(
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
};
