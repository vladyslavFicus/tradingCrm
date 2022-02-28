import { OrderDirection, OrderTypeOnCreation } from 'types/trading-engine';

/**
 * Determine order type depends on order direction and prices
 *
 * @param args
 */
interface DetermineOrderTypeArguments {
  direction: OrderDirection,
  pendingOrder: boolean,
  openPrice?: number | null,
  currentPrice?: number,
}

export const determineOrderType = (args: DetermineOrderTypeArguments): OrderTypeOnCreation => {
  const {
    direction,
    pendingOrder,
    openPrice = 0,
    currentPrice = 0,
  } = args;

  // If order isn't pending or open price is equal to current price then it's MARKET order
  if (!pendingOrder || openPrice === currentPrice) {
    return OrderTypeOnCreation.MARKET;
  }

  // If it's pending order and direction is BUY --> determine type depends on price
  if (openPrice !== null && direction === OrderDirection.BUY) {
    return openPrice > currentPrice ? OrderTypeOnCreation.STOP : OrderTypeOnCreation.LIMIT;
  }

  // If it's pending order and direction is SELL --> determine type depends on price
  if (openPrice !== null && direction === OrderDirection.SELL) {
    return openPrice > currentPrice ? OrderTypeOnCreation.LIMIT : OrderTypeOnCreation.STOP;
  }

  // In other cases it's a MARKET order
  return OrderTypeOnCreation.MARKET;
};
