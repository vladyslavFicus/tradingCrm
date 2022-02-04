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
  match: { params: { id } },
  orderStatuses,
}) => (
  <Query
    query={REQUEST}
    variables={{
      args: {
        orderStatuses,
        accountUuid: id,
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default TradingEngineOrdersQuery;
