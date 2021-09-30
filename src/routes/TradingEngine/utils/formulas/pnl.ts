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

export const calculatePnL = (args: CalculatePnLArguments): number | null => {
  const {
    type,
    openPrice,
    currentPriceBid,
    currentPriceAsk,
    lotSize,
    volume,
    exchangeRate,
  } = args;

  // If no current bid or ask provided then return null. Because we can't calculate p&l without these data
  if (!Number.isFinite(currentPriceBid) || !Number.isFinite(currentPriceAsk)) {
    return null;
  }

  // Calculate P&L for order with type SELL
  if (type === OrderType.SELL) {
    return (openPrice - currentPriceAsk) * lotSize * volume * exchangeRate;
  }

  // Calculate P&L for order with type BUY
  if (type === OrderType.BUY) {
    return (currentPriceBid - openPrice) * lotSize * volume * exchangeRate;
  }

  return null;
};
