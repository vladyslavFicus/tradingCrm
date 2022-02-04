import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { RouteComponentProps } from 'react-router-dom';
import { ApolloComponentFn } from 'apollo/types/apolloComponentFn';

interface RouteMatchParams {
  id: string,
}

interface Props extends RouteComponentProps<RouteMatchParams> {
  children: ApolloComponentFn,
}

const REQUEST = gql`
  query TradingEngineAdmin_TradingEngineSymbolQuery($symbolName: String!) {
    tradingEngineAdminSymbol(
      symbolName: $symbolName
    ) {
      symbol
      source
      digits
      description
      securityName
      bidSpread
      askSpread
      stopsLevel
      lotSize
      percentage
      baseCurrency
      quoteCurrency
      symbolType
      filtration {
        filterSmoothing
        discardFiltrationLevel
        softFilter
        softFiltrationLevel
        hardFilter
        hardFiltrationLevel
      }
      swapConfigs {
        enable
        type
        long
        short
        rollover
      }
      backgroundColor
      symbolSessions {
        dayOfWeek
        quote {
          openTime
          closeTime
        }
        trade {
          openTime
          closeTime
        }
      }
    }
  }
`;

const TradingEngineSymbolQuery = ({ children, match: { params: { id } } }: Props) => (
  <Query
    query={REQUEST}
    variables={{ symbolName: id }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

export default TradingEngineSymbolQuery;
