import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`mutation IpWhitelist_DeleteIpMutation(
    $uuid: String!
) {
  ipWhitelist {
    delete(
        uuid: $uuid
    )
  }
}
`;

const IpWhitelistDeleteIpMutation = ({ children }: Props) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

export default IpWhitelistDeleteIpMutation;
