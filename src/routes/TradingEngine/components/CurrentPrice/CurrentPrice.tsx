import React from 'react';
import { OrderType } from 'types/trading-engine';
import CircleLoader from 'components/CircleLoader';

interface Props {
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
    <Choose>
      <When condition={currentPrice !== null && !Number.isNaN(currentPrice)}>
        {currentPrice?.toFixed(digits)}
      </When>
      <Otherwise>
        <CircleLoader size={20} />
      </Otherwise>
    </Choose>
  );
}

export default React.memo(CurrentPrice);
