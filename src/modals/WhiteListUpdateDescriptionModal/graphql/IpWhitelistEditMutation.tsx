import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

type Props = {
  children: ApolloComponentFn,
}

const REQUEST = gql`mutation IpWhitelist_EditIpMutation(
   $uuid: String!
   $description: String!
) {
  ipWhitelist {
    edit(
        uuid: $uuid
        description: $description
    ){
        uuid
        description
    }
  }
}
`;

const IpWhitelistEditMutation = ({ children }: Props) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);


export default IpWhitelistEditMutation;
