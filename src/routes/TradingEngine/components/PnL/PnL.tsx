import React from 'react';
import classNames from 'classnames';
import { OrderType } from 'types/trading-engine';
import CircleLoader from 'components/CircleLoader';
import { calculatePnL } from 'routes/TradingEngine/utils/formulas';
import './PnL.scss';

interface Props {
  type: OrderType,
  openPrice: number,
  currentPriceBid: number,
  currentPriceAsk: number,
  volume: number,
  lotSize: number,
  exchangeRate: number,
}

function PnL(props: Props) {
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
    <Choose>
      <When condition={pnl !== null}>
        <span className={classNames('TradingEngineOrdersGrid__cell-value', {
          'PnL--positive': pnl && pnl > 0,
          'PnL--negative': pnl && pnl < 0,
        })}
        >
          {pnl?.toFixed(2)}
        </span>
      </When>
      <Otherwise>
        <CircleLoader size={20} />
      </Otherwise>
    </Choose>
  );
}

export default React.memo(PnL);
