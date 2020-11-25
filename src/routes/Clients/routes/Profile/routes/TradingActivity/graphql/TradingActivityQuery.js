import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query TradingActivityQuery(
  $profileUUID: String,
  $tradeId: Int,
  $openTimeStart: String,
  $openTimeEnd: String,
  $closeTimeStart: String,
  $closeTimeEnd: String,
  $operationType: TradingActivity__OperationTypes__Enum,
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
  tradingActivity(
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
      tradeId
      tradeType
      login
      platformType
      symbol
      digits
      operationType
      volume
      openTime
      closeTime
      openPrice
      closePrice
      openRate
      closeRate
      stopLoss
      takeProfit
      expiration
      reason
      commission
      commissionAgent
      swap
      profit
      taxes
      magic
      comment
      timestamp
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

const TradingActivityQuery = ({
  children,
  location: { state },
  match: { params: { id: profileUUID } },
}) => (
  <Query
    query={REQUEST}
    variables={{
      profileUUID,
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

TradingActivityQuery.propTypes = {
  ...PropTypes.router,
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default TradingActivityQuery;
