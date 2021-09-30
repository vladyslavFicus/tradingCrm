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
  loaderSize: number,
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
    loaderSize = 20,
  } = props;

  const pnl = calculatePnL({ type, openPrice, currentPriceBid, currentPriceAsk, volume, lotSize, exchangeRate });

  return (
    <Choose>
      <When condition={pnl !== null}>
        <span className={classNames('PnL', {
          'PnL--positive': pnl && pnl > 0,
          'PnL--negative': pnl && pnl < 0,
        })}
        >
          {pnl?.toFixed(2)}
        </span>
      </When>
      <Otherwise>
        <CircleLoader className="PnL__loader" size={loaderSize} />
      </Otherwise>
    </Choose>
  );
}

export default React.memo(PnL);
