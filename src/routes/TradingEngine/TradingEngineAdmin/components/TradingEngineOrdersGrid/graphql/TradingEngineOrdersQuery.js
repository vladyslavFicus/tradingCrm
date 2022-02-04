import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query TradingEngine_TradingEngineOrdersQuery(
  $args: TradingEngineSearch__Input
) {
  tradingEngineOrders(args: $args) {
    content {
      id
      accountLogin
      tradeType
      symbol
      symbolAlias
      direction
      digits
      takeProfit
      stopLoss
      openPrice
      closePrice
      marginRate
      volumeUnits
      volumeLots
      commission
      swaps
      status
      group
      margin
      pnl {
        gross
        net
      }
      time {
        creation
        modification
        expiration
        closing
      }
      comment
      type
      account {
        currency
      }
      symbolConfig {
        lotSize
        bidAdjustment
        askAdjustment
      }
    }
    page
    number
    totalElements
    size
    last
  }
}`;

const TradingEngineOrdersQuery = ({
  children,
  location: { state },
}) => (
  <Query
    query={REQUEST}
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
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

TradingEngineOrdersQuery.propTypes = {
  ...PropTypes.router,
  children: PropTypes.func.isRequired,
};

export default TradingEngineOrdersQuery;
