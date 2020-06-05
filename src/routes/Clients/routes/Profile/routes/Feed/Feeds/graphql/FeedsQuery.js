import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query FeedsQuery_Feeds(
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
      }
    }
  }
}`;

const FeedsQuery = ({
  children,
  location: { query },
  match: {
    params: {
      id: targetUUID,
    },
  },
}) => (
  <Query
    query={REQUEST}
    variables={{
      ...query ? query.filters : {},
      targetUUID,
      limit: 20,
      page: 0,
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

FeedsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.object,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

export default FeedsQuery;
