import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query DistributionRuleFeeds_FeedsQuery(
    $searchBy: String
    $creationDateFrom: String
    $creationDateTo: String
    $page: Int
    $limit: Int
    $sortColumn: String
    $sortDirection: String
    $targetUuid: String
    $auditLogType: String
  ) {
    feeds (
      searchBy: $searchBy
      creationDateFrom: $creationDateFrom
      creationDateTo: $creationDateTo
      page: $page
      limit: $limit
      sortColumn: $sortColumn
      sortDirection: $sortDirection
      targetUUID: $targetUuid
      auditLogType: $auditLogType
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
  }
`;

const FeedsQuery = ({
  children,
  location: { state },
  match: { params: { id } },
}) => (
  <Query
    query={REQUEST}
    variables={{
      ...state?.filters,
      targetUuid: id,
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default FeedsQuery;