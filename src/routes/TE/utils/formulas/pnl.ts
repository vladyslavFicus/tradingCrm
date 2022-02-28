import { TradingEngine__OperationTypes__Enum as OrderType } from '__generated__/types';

/**
 * Calculate floating PnL
 *
 * @param args
 */
interface CalculatePnLArguments {
  type: OrderType,
  openPrice: number | null,
  currentPriceBid?: number,
  currentPriceAsk?: number,
  lotSize?: number,
  volume?: number,
  exchangeRate?: number,
}

export const calculatePnL = (args: CalculatePnLArguments): number => {
  const {
    type,
    openPrice = 0,
    currentPriceBid = 0,
    currentPriceAsk = 0,
    lotSize = 0,
    volume = 0,
    exchangeRate = 0,
  } = args;

  let pnl = 0;

  // Calculate P&L for order with type SELL
  if (openPrice !== null && type === OrderType.SELL) {
    pnl = (openPrice - currentPriceAsk) * lotSize * volume * exchangeRate;
  }

  // Calculate P&L for order with type BUY
  if (openPrice !== null && type === OrderType.BUY) {
    pnl = (currentPriceBid - openPrice) * lotSize * volume * exchangeRate;
  }

  // Rounding PnL to 2 decimals after point
  return Number(pnl.toFixed(2));
};
