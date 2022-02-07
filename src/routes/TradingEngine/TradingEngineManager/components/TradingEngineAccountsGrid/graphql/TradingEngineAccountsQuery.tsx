import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { RouteComponentProps } from 'react-router-dom';
import { State } from 'types';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

interface Props extends RouteComponentProps<any, any, State> {
  children: ApolloComponentFn,
}

const REQUEST = gql`
  query TradingEngine_AccountsQuery(
    $args: TradingEngineSearch__Input
  ) {
    tradingEngineAccounts (
      args: $args
    ) {
      content {
        uuid
        name
        login
        group
        credit
        profileUuid
        registrationDate
        leverage
        balance
        accountType
      }
      totalElements
      size
      last
      number
    }
  }
`;

const TradingEngineAccountsQuery = ({ children, location: { state } }: Props) => (
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

export default TradingEngineAccountsQuery;
