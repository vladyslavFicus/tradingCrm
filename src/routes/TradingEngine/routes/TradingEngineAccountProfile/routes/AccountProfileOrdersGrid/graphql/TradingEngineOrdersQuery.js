import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query TradingEngine_TradingEngineOrdersQuery(
  $profileUUID: String,
  $tradeId: Int,
  $openTimeStart: String,
  $openTimeEnd: String,
  $closeTimeStart: String,
  $closeTimeEnd: String,
  $operationType: TradingEngine__OperationTypes__Enum,
  $symbol: String,
  $volumeFrom: Float,
  $volumeTo: Float,
  $status: TradingActivity__Statuses__Enum,
  $sortColumn: String,
  $sortDirection: String,
  $page: Int,
  $limit: Int,
  $loginIds: [Int],
  $tradeType: String,
  $platformType: String,
  $agentIds: [String],
) {
  tradingEngineOrders(
    profileUUID: $profileUUID,
    tradeId: $tradeId,
    openTimeStart: $openTimeStart,
    openTimeEnd: $openTimeEnd,
    closeTimeStart: $closeTimeStart,
    closeTimeEnd: $closeTimeEnd,
    operationType: $operationType,
    symbol: $symbol,
    volumeFrom: $volumeFrom,
    volumeTo: $volumeTo,
    status: $status,
    sortColumn: $sortColumn,
    sortDirection: $sortDirection,
    page: $page,
    limit: $limit,
    loginIds: $loginIds,
    tradeType: $tradeType,
    platformType: $platformType,
    agentIds: $agentIds,
  ) {
    content {
      id
      login
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
      lotSize
      commission
      swaps
      pnl
      time
      comment
      operationType
      tradeStatus
      originalAgent {
        uuid
        fullName
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
      profileUUID: 'PLAYER-6ffc393a-e611-4da9-ba48-358c2b678dc3',
      tradeType: 'LIVE',
      ...state?.filters,
      page: 0,
      limit: 20,
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
