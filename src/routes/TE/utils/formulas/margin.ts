import { TradingEngine__SymbolTypes__Enum as SymbolType } from '__generated__/types';

/**
 * Calculate required margin
 *
 * @param args
 */
interface CalculateMarginArguments {
  symbolType?: SymbolType,
  openPrice?: number | null,
  lotSize?: number,
  percentage?: number,
  volume?: number,
  leverage?: number,
  marginRate?: number,
}

export const calculateMargin = (args: CalculateMarginArguments): number => {
  const {
    symbolType,
    openPrice = 0,
    lotSize = 0,
    percentage = 0,
    volume = 0,
    leverage = 0,
    marginRate = 0,
  } = args;

  let margin = 0;

  // Can calculate only when symbolType and openPrice and leverage exists
  if (!!symbolType && !!openPrice && !!leverage) {
    const multiplier = symbolType === SymbolType.FOREX ? 1 / leverage : openPrice;

    margin = marginRate * volume * lotSize * multiplier * (percentage / 100);
  }

  // Rounding margin to 2 decimals after point
  return Number(margin.toFixed(2));
};
