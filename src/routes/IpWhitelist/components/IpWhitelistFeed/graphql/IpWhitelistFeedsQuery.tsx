import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { LocationState } from 'types';
import { getBrand } from 'config';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';
import { IpWhitelistFeedFilters } from '../types';

interface Props {
  children: ApolloComponentFn,
  location: LocationState<IpWhitelistFeedFilters>,
}

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
    auditCategory: WHITELIST,
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

const IpWhitelistFeedQuery = ({
  children,
  location: { state },
}: Props) => (
  <Query
    query={REQUEST}
    variables={{
      ...state?.filters,
      targetUUID: getBrand().id,
      limit: 20,
      page: 0,
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

export default IpWhitelistFeedQuery;
