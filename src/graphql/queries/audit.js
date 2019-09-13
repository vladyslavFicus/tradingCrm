import gql from 'graphql-tag';

const feedsQuery = gql`query getFeeds(
  $searchBy: String,
  $creationDateFrom: String,
  $creationDateTo: String,
  $page: Int,
  $limit: Int,
  $sortColumn: String,
  $sortDirection: String,
  $targetUUID: String,
  $auditLogType: String,
) {
  feeds (
    searchBy: $searchBy,
    creationDateFrom: $creationDateFrom,
    creationDateTo: $creationDateTo,
    page: $page,
    limit: $limit,
    sortColumn: $sortColumn,
    sortDirection: $sortDirection,
    targetUUID: $targetUUID,
    auditLogType: $auditLogType,
  ) {
    error {
      error
      fields_errors
    }
    data {
      page
      size
      last
      totalElements
      number
      content {
        id
        brandId
        authorFullName
        authorUuid
        creationDate
        details
        ip
        targetFullName
        targetUuid
        type
        uuid
        operator {
          fullName
        }
      } 
    }
  } 
}`;

const feedTypesQuery = gql`query getFeedTypes($playerUUID: String!) {
  feedTypes (playerUUID: $playerUUID) {
    error {
      error
      fields_errors
    }
    data {
      PLAYER_PROFILE_CHANGED
      RESET_PASSWORD
      LOG_IN
      CHANGE_PASSWORD
      PLAYER_PROFILE_REGISTERED
      LOG_OUT
      FAILED_LOGIN_ATTEMPT
      PROFILE_ASSIGN
      CHANGE_LEVERAGE_REQUESTED
    } 
  }
}`;

export { feedsQuery, feedTypesQuery };
