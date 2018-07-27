import gql from 'graphql-tag';

const tradingActivityQuery = gql`query clientTradingActivity(
  $tradeId: Int,
  $openTimeStart: BigInt,
  $openTimeEnd: BigInt,
  $closeTimeStart: BigInt,
  $closeTimeEnd: BigInt,
  $cmd: tradingActivityCommand,
  $symbol: String,
  $volumeFrom: Int,
  $volumeTo: Int,
  $status: tradingActivityStatus,
  $sortColumn: String,
  $sortDirection: String,
  $page: Int,
  $limit: Int,
) {
  clientTradingActivity(
    tradeId: $tradeId,
    openTimeStart: $openTimeStart,
    openTimeEnd: $openTimeEnd,
    closeTimeStart: $closeTimeStart,
    closeTimeEnd: $closeTimeEnd,
    cmd: $cmd,
    symbol: $symbol,
    volumeFrom: $volumeFrom,
    volumeTo: $volumeTo,
    status: $status,
    sortColumn: $sortColumn,
    sortDirection: $sortDirection,
    page: $page,
    limit: $limit,
    ) {
    page
    number
    totalElements
    size
    last
      content {
        id
        tradeId
        login
        symbol
        digits
        cmd
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
        storage
        profit
        taxes
        magic
        comment
        timestamp
      }
  }
}`;

export {
  tradingActivityQuery,
};
