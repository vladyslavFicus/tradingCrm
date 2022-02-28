import React from 'react';
import { TradingEngine__OperationTypes__Enum as OrderType } from '__generated__/types';
import { DebugContainer } from 'components/DebugMode';

interface Props {
  type: OrderType,
  digits: number,
  currentPriceBid: number,
  currentPriceAsk: number,
}

function CurrentPriceDebug(props: Props) {
  const {
    type,
    digits,
    currentPriceBid,
    currentPriceAsk,
  } = props;

  const isBid = [
    OrderType.BUY,
    OrderType.SELL_LIMIT,
    OrderType.SELL_STOP,
  ].includes(type);

  const isAsk = [
    OrderType.SELL,
    OrderType.BUY_LIMIT,
    OrderType.BUY_STOP,
  ].includes(type);

  return (
    <DebugContainer>
      <div>
        <span className="DebugContainer__label">type:</span> {type}
      </div>
      <div>
        <span className="DebugContainer__label">currentPriceBid:</span> {currentPriceBid}
      </div>
      <div>
        <span className="DebugContainer__label">currentPriceAsk:</span> {currentPriceAsk}
      </div>
      <div>
        <span className="DebugContainer__label">digits:</span> {digits}
      </div>
      <div>--</div>
      <div>
        <If condition={isBid}>
          <span className="DebugContainer__label">Used `bid` price for: </span>
          [{OrderType.BUY}, {OrderType.SELL_LIMIT}, {OrderType.SELL_STOP}]
        </If>
        <If condition={isAsk}>
          <span className="DebugContainer__label">Used `ask` price for: </span>
          [{OrderType.SELL}, {OrderType.BUY_LIMIT}, {OrderType.BUY_STOP}]
        </If>
      </div>
    </DebugContainer>
  );
}

export default React.memo(CurrentPriceDebug);
