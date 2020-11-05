import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query OperatorFeeds_getFeeds(
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
}`;

const FeedsQuery = ({ children, location: { query }, match: { params: { id } } }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{
      ...query && query.filters,
      targetUUID: id,
      limit: 20,
    }}
  >
    {children}
  </Query>
);

FeedsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default FeedsQuery;
