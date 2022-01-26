import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { getBrand } from 'config';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

const REQUEST = gql`
  query IpWhitelist_FeedFilter($uuid: String!) {
    feedTypes (
      uuid: $uuid
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
