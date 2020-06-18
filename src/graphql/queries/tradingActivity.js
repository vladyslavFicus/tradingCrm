import gql from 'graphql-tag';

const tradingActivityQuery = gql`query tradingActivity(
  $profileUUID: String,
  $tradeId: Int,
  $openTimeStart: String,
  $openTimeEnd: String,
  $closeTimeStart: String,
  $closeTimeEnd: String,
  $operationType: TradingActivity__OperationTypes,
  $symbol: String,
  $volumeFrom: Float,
  $volumeTo: Float,
  $status: TradingActivity__Statuses,
  $sortColumn: String,
  $sortDirection: String,
  $page: Int,
  $limit: Int,
  $loginIds: [Int],
  $tradeType: String,
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
    agentIds: $agentIds,
  ) {
    data {
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
    error {
      error
      fields_errors
    }
  }
}`;

export {
  tradingActivityQuery,
};
