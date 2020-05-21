import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query getFeeds(
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

const FeedsQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

FeedsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default FeedsQuery;
