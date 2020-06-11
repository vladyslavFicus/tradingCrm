import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query PartnerFeedsTab_getFeedsQuery(
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
      error {
        error
      }
    }
  }
`;

const getFeedsQuery = ({
  children,
  location: { query },
  match: { params: { id } },
}) => (
  <Query
    query={REQUEST}
    variables={{
      ...query && query.filters,
      targetUuid: id,
      limit: 20,
      page: 0,
    }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

getFeedsQuery.propTypes = {
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

export default getFeedsQuery;
