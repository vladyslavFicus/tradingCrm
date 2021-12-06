import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';
import { LocationState } from 'types/location';

export interface Props {
  children: ApolloComponentFn,
  location: {
    state: LocationState
  },
}

const REQUEST = gql`
  query TradingEngine_TradingEngineGroupsListQuery(
    $args: TradingEngineSearch__Input
  ) {
    tradingEngineGroupsList(args: $args) {
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

const TradingEngineGroupsListQuery = ({ children, location: { state } }: Props) => (
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

export default TradingEngineGroupsListQuery;
