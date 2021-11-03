import React from 'react';
import { OrderType } from 'types/trading-engine';
import { DebugContainer } from 'components/DebugMode';
import { calculatePnL } from 'routes/TradingEngine/utils/formulas';

interface Props {
  type: OrderType,
  openPrice: number,
  currentPriceBid?: number,
  currentPriceAsk?: number,
  volume: number,
  lotSize: number,
  exchangeRate?: number,
}

function PnLDebug(props: Props) {
  const {
    type,
    openPrice,
    currentPriceBid,
    currentPriceAsk,
    volume,
    lotSize,
    exchangeRate,
  } = props;

  const pnl = calculatePnL({ type, openPrice, currentPriceBid, currentPriceAsk, volume, lotSize, exchangeRate });

  return (
    <DebugContainer>
      <div>
        <span className="DebugContainer__label">type:</span> {type}
      </div>
      <div>
        <span className="DebugContainer__label">openPrice:</span> {openPrice}
      </div>
      <div>
        <span className="DebugContainer__label">currentPriceBid:</span> {currentPriceBid}
      </div>
      <div>
        <span className="DebugContainer__label">currentPriceAsk:</span> {currentPriceAsk}
      </div>
      <div>
        <span className="DebugContainer__label">volume:</span> {volume}
      </div>
      <div>
        <span className="DebugContainer__label">lotSize:</span> {lotSize}
      </div>
      <div>
        <span className="DebugContainer__label">exchangeRate:</span> {exchangeRate}
      </div>
      <div>--</div>
      <div>
        <span className="DebugContainer__label">formula:</span>&nbsp;
        <If condition={type === OrderType.SELL}>
          (openPrice - currentPriceAsk) * lotSize * volume * exchangeRate = {pnl}
        </If>

        <If condition={type === OrderType.BUY}>
          (currentPriceBid - openPrice) * lotSize * volume * exchangeRate = {pnl}
        </If>
      </div>
      <div>
        <span className="DebugContainer__label">formula:</span>&nbsp;
        <If condition={type === OrderType.SELL}>
          ({openPrice} - {currentPriceAsk}) * {lotSize} * {volume} * {exchangeRate} = {pnl}
        </If>

        <If condition={type === OrderType.BUY}>
          ({currentPriceBid} - {openPrice}) * {lotSize} * {volume} * {exchangeRate} = {pnl}
        </If>
      </div>
    </DebugContainer>
  );
}

export default React.memo(PnLDebug);
