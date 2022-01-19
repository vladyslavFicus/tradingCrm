import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

interface Props {
  children: ApolloComponentFn;
}

const REQUEST = gql`mutation IpWhitelist_EditIpMutation(
   $uuid: String!
   $description: String
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
