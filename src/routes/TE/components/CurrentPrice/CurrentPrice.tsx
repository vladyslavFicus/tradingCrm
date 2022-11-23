import React from 'react';
import { TradingEngine__OperationTypes__Enum as OrderType } from '__generated__/types';
import CircleLoader from 'components/CircleLoader';
import CurrentPriceDebug from './CurrentPriceDebug';

type Props = {
  type: OrderType,
  digits: number,
  currentPriceBid: number,
  currentPriceAsk: number,
}

function CurrentPrice(props: Props) {
  const {
    type,
    digits,
    currentPriceBid,
    currentPriceAsk,
  } = props;

  // Get different current price depends on order type
  const currentPrice = [
    OrderType.BUY,
    OrderType.SELL_LIMIT,
    OrderType.SELL_STOP,
  ].includes(type) ? currentPriceBid : currentPriceAsk;

  return (
    <>
      <Choose>
        <When condition={currentPrice !== null && !Number.isNaN(currentPrice)}>
          {currentPrice?.toFixed(digits)}
        </When>
        <Otherwise>
          <CircleLoader size={20} />
        </Otherwise>
      </Choose>

      <CurrentPriceDebug {...props} />
    </>
  );
}

export default React.memo(CurrentPrice);
