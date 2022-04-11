import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { getBrand } from 'config';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

const REQUEST = gql`
  query IpWhitelist_FeedFilter($uuid: String!) {
    feedTypes (
      uuid: $uuid
      filters: {
        auditCategory: WHITELIST
      }
    )
  }
`;

interface Props {
  children: ApolloComponentFn,
}

const IpWhitelistFeedsFiltersQuery = ({ children }: Props) => (
  <Query query={REQUEST} variables={{ uuid: getBrand().id }}>
    {children}
  </Query>
);

export default IpWhitelistFeedsFiltersQuery;
