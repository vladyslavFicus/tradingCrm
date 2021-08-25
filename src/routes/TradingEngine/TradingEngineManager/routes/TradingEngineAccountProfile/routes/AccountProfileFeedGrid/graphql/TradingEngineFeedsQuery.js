/* eslint-disable */

import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query TradingEngine_FeedsQuery(
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

const TradingEngineFeedsQuery = ({
  children,
  location: { state },
  match: {
    params: {
      id: targetUUID,
    },
  },
}) => (
  <Query
    query={REQUEST}
    variables={{
      ...state?.filters,
      // For test
      targetUUID: "PLAYER-5d9efa6d-1011-40e5-8081-532ceb4f2c0a",
      limit: 20,
      page: 0,
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

TradingEngineFeedsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

export default TradingEngineFeedsQuery;
