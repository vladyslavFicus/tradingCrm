import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';
import { LocationState } from 'types';
import { GroupFilters } from '../types/group';

export interface Props {
  children: ApolloComponentFn,
  location: LocationState<GroupFilters>
}

const REQUEST = gql`
  query TradingEngine_AdminGroupsListQuery(
    $args: TradingEngineGroupsSearch__Input
  ) {
    tradingEngineAdminGroups(args: $args) {
      content {
        groupName
        description
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
