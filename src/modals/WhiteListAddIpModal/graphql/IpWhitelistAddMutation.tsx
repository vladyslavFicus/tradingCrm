import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`mutation IpWhitelist_AddIpMutation(
   $ip: String!
   $description: String!
) {
  ipWhitelist {
    add(
      ip: $ip
      description: $description
    ) {
      ip
      description
    }
  }
}
`;

const IpWhitelistAddIpMutation = ({ children }: Props) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

export default IpWhitelistAddIpMutation;
