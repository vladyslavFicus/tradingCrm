import React from 'react';
import { CircleLoader } from 'components';
import {
  TradingEngine__SymbolTypes__Enum as SymbolType,
} from '__generated__/types';
import { calculateMargin } from 'routes/TE/utils/formulas';
import MarginDebug from './MarginDebug';
import './Margin.scss';

type Props = {
  symbolType?: SymbolType,
  openPrice?: number | null,
  lotSize?: number,
  percentage?: number,
  volume?: number,
  leverage?: number,
  marginRate?: number,
  loaderSize?: number,
}

const Margin = (props: Props) => {
  const {
    symbolType,
    openPrice,
    lotSize,
    percentage,
    volume,
    leverage,
    marginRate,
    loaderSize,
  } = props;

  const loading = !symbolType
    || !Number.isFinite(openPrice)
    || !Number.isFinite(leverage)
    || !Number.isFinite(percentage)
    || !Number.isFinite(marginRate);

  if (loading) {
    return (
      <CircleLoader className="Margin__loader" size={loaderSize} />
    );
  }

  const margin = calculateMargin({
    symbolType,
    openPrice,
    volume,
    lotSize,
    leverage,
    marginRate,
    percentage,
  });

  return (
    <>
      <span
        data-testid="Margin"
        className="Margin"
      >
        {margin.toFixed(2)}
      </span>

      <MarginDebug {...props} />
    </>
  );
};

Margin.defaultProps = {
  symbolType: null,
  openPrice: null,
  lotSize: null,
  percentage: null,
  volume: null,
  leverage: null,
  marginRate: null,
  loaderSize: 20,
};

export default React.memo(Margin);
