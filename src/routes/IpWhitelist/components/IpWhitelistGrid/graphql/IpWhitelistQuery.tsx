import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';
import { LocationState } from 'types';
import { IpWhitelistFilters } from '../types';

interface Props {
  children: ApolloComponentFn,
  location: LocationState<IpWhitelistFilters>
}

const REQUEST = gql`
  query IpWhitelist_ipWhitelistSearch($args: IpWhitelistSearch__Input) {
    ipWhitelistSearch(args:$args) {
      content {
        uuid
        ip
        createdAt
        description
      }
      page
      number
      totalElements
      size
      last
    }
  }
`;

const IpWhitelistQuery = ({ children, location: { state } }: Props) => (
  <Query
    query={REQUEST}
    variables={{
      args: {
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

export default IpWhitelistQuery;
