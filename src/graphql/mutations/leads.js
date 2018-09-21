import gql from 'graphql-tag';

const promoteLeadToClient = gql`mutation promoteToClient(
  $allRecords: Boolean,
  $leadIds: [String],
  $filters: LeadsListFilters,
  $totalRecords: Int,
  $queryIds: [String],
) {
  leads {
    bulkPromote (
      allRecords: $allRecords,
      leadIds: $leadIds,
      filters: $filters,
      totalRecords: $totalRecords,
      queryIds: $queryIds,
    ) {
      succeed
      failed
    }
  }
}`;

export {
  promoteLeadToClient,
};
