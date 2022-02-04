import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
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
