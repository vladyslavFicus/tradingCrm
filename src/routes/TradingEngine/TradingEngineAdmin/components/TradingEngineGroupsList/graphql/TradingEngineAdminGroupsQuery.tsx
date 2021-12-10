import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';
import { LocationState } from 'types';
import { GroupFilters } from '../types/group';

export interface Props {
  children: ApolloComponentFn,
  location: LocationState<GroupFilters>
}

const REQUEST = gql`
  query TradingEngine_TradingEngineAdminGroupsQuery(
    $args: TradingEngineGroupsSearch__Input
  ) {
    tradingEngineAdminGroups(args: $args) {
      content {
        groupName
        brand
        marginCallLevel
        stopoutLevel
        groupSecurities {
          security {
            name
          }
        }
      }
      page
      number
      totalElements
      size
      last
    }
  }
`;

const TradingEngineAdminGroupsQuery = ({ children, location: { state } }: Props) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{
      args: {
        ...state && state.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    }}
  >
    {children}
  </Query>
);

export default TradingEngineAdminGroupsQuery;
