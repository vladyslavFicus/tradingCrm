import gql from 'graphql-tag';

const tradingActivityQuery = gql`query clientTradingActivity(
  $profileUUID: String,
  $tradeId: Int,
  $openTimeStart: String,
  $openTimeEnd: String,
  $closeTimeStart: String,
  $closeTimeEnd: String,
  $operationType: operationTypes,
  $symbol: String,
  $volumeFrom: Float,
  $volumeTo: Float,
  $status: tradingActivityStatus,
  $sortColumn: String,
  $sortDirection: String,
  $page: Int,
  $limit: Int,
  $loginIds: [Int],
  $tradeType: String,
  $agentIds: [String],
) {
  clientTradingActivity(
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
    agentIds: $agentIds,
  ) {
    data {
      page
      number
      totalElements
      size
      last
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
    }
    error {
      error
      fields_errors
    }
  }
}`;

export {
  tradingActivityQuery,
};
