import React from 'react';
import classNames from 'classnames';
import { CircleLoader } from 'components';
import { TradingEngine__OperationTypes__Enum as OrderType } from '__generated__/types';
import { calculatePnL } from 'routes/TE/utils/formulas';
import PnLDebug from './PnLDebug';
import './PnL.scss';

type Props = {
  type: OrderType,
  openPrice: number,
  currentPriceBid?: number,
  currentPriceAsk?: number,
  volume: number,
  lotSize: number,
  exchangeRate?: number,
  loaderSize?: number,
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
    loaderSize,
  } = props;

  const loading = !Number.isFinite(currentPriceBid)
    || !Number.isFinite(currentPriceAsk)
    || !Number.isFinite(exchangeRate);

  if (loading) {
    return (
      <CircleLoader className="PnL__loader" size={loaderSize} />
    );
  }

  const pnl = calculatePnL({ type, openPrice, currentPriceBid, currentPriceAsk, volume, lotSize, exchangeRate });

  return (
    <>
      <span
        data-testid="PnL"
        className={classNames('PnL', {
          'PnL--positive': pnl > 0,
          'PnL--negative': pnl < 0,
        })}
      >
        {pnl.toFixed(2)}
      </span>

      <PnLDebug {...props} />
    </>
  );
}

PnL.defaultProps = {
  currentPriceBid: null,
  currentPriceAsk: null,
  exchangeRate: null,
  loaderSize: 20,
};

export default React.memo(PnL);
