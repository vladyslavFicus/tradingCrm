import { OrderType } from 'types/trading-engine';

/**
 * Calculate floating PnL
 *
 * @param args
 */
interface CalculatePnLArguments {
  type: OrderType,
  openPrice: number,
  currentPriceBid: number,
  currentPriceAsk: number,
  lotSize: number,
  volume: number,
  exchangeRate: number,
}

export const calculatePnL = (args: CalculatePnLArguments): number => {
  const {
    type,
    openPrice,
    currentPriceBid,
    currentPriceAsk,
    lotSize,
    volume,
    exchangeRate,
  } = args;

  let pnl = 0;

  // Calculate P&L for order with type SELL
  if (type === OrderType.SELL) {
    pnl = (openPrice - currentPriceAsk) * lotSize * volume * exchangeRate;
  }

  // Calculate P&L for order with type BUY
  if (type === OrderType.BUY) {
    pnl = (currentPriceBid - openPrice) * lotSize * volume * exchangeRate;
  }

  // Rounding PnL to 2 decimals after point
  return Number(pnl.toFixed(2));
};
