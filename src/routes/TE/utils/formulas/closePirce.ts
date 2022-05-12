import { OrderDirection } from 'types/trading-engine';

/**
 * Calculate floating order close price depends on PnL value
 *
 * @param args
 */
interface CalculateClosePriceArguments {
  direction: OrderDirection,
  pnl: number | null,
  openPrice: number | null,
  lotSize?: number,
  digits?: number,
  volume?: number,
  exchangeRate?: number,
}

export const calculateClosePrice = (args: CalculateClosePriceArguments): number => {
  const {
    direction,
    pnl = 0,
    openPrice = 0,
    lotSize = 0,
    digits = 0,
    volume = 0,
    exchangeRate = 0,
  } = args;

  let closePrice = 0;

  if (!!pnl && !!openPrice && !!volume && !!exchangeRate) {
    // Calculate close price for SELL orders
    if (direction === OrderDirection.SELL) {
      closePrice = -(pnl / (lotSize * volume) / exchangeRate) + openPrice;
    }

    // Calculate close price for BUY orders
    if (direction === OrderDirection.BUY) {
      closePrice = (pnl / (lotSize * volume) / exchangeRate) + openPrice;
    }
  }

  return Number(closePrice.toFixed(digits));
};
