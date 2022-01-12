import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

export interface Props extends RouteComponentProps<{ id: string }> {
  children: ApolloComponentFn;
}

const REQUEST = gql`
  query TradingEngineAdmin_TradingEngineGroupQuery($groupName: String!) {
    tradingEngineAdminGroup(
      groupName: $groupName
    ) {
      enable
      groupName
      description
      currency
      defaultLeverage
      useSwap
      hedgeProhibited
      archivePeriodDays
      archiveMaxBalance
      marginCallLevel
      stopoutLevel
      groupSecurities {
        security {
          id
          name
        }
        show
        spreadDiff
        lotMin
        lotMax
        lotStep
        commissionBase
        commissionType
        commissionLots
      }
      groupMargins {
        symbol
        percentage
        swapShort
        swapLong
      }
    }
  }
`;

const GroupQuery = ({ children, match: { params: { id } } }: Props) => (
  <Query
    query={REQUEST}
    variables={{ groupName: id }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

export default GroupQuery;
