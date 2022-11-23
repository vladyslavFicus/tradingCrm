import React from 'react';
import {
  TradingEngine__SymbolTypes__Enum as SymbolType,
} from '__generated__/types';
import { DebugContainer } from 'components/DebugMode';
import { calculateMargin } from 'routes/TE/utils/formulas';

type Props = {
  symbolType?: SymbolType,
  openPrice?: number | null,
  lotSize?: number,
  percentage?: number,
  volume?: number,
  leverage?: number,
  marginRate?: number,
}

const MarginDebug = (props: Props) => {
  const {
    symbolType,
    openPrice,
    lotSize,
    percentage,
    volume,
    leverage,
    marginRate,
  } = props;

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
    <DebugContainer>
      <div>
        <span className="DebugContainer__label">symbolType:</span> {symbolType}
      </div>
      <div>
        <span className="DebugContainer__label">openPrice:</span> {openPrice}
      </div>
      <div>
        <span className="DebugContainer__label">lotSize:</span> {lotSize}
      </div>
      <div>
        <span className="DebugContainer__label">percentage:</span> {percentage}
      </div>
      <div>
        <span className="DebugContainer__label">volume:</span> {volume}
      </div>
      <div>
        <span className="DebugContainer__label">leverage:</span> {leverage}
      </div>
      <div>
        <span className="DebugContainer__label">marginRate:</span> {marginRate}
      </div>
      <div>--</div>
      <div>
        <span className="DebugContainer__label">formula:</span>&nbsp;
        <If condition={symbolType === SymbolType.FOREX}>
          marginRate * volume * lotSize * (1 / leverage) * (percentage / 100) = {margin}
        </If>

        <If condition={symbolType === SymbolType.CFD}>
          marginRate * volume * lotSize * openPrice * (percentage / 100) = {margin}
        </If>
      </div>
      <div>
        <span className="DebugContainer__label">formula:</span>&nbsp;
        <If condition={symbolType === SymbolType.FOREX}>
          {marginRate} * {volume} * {lotSize} * (1 / {leverage}) * ({percentage} / 100) = {margin}
        </If>

        <If condition={symbolType === SymbolType.CFD}>
          {marginRate} * {volume} * {lotSize} * {openPrice} * ({percentage} / 100) = {margin}
        </If>
      </div>
    </DebugContainer>
  );
};

MarginDebug.defaultProps = {
  symbolType: null,
  openPrice: null,
  lotSize: null,
  percentage: null,
  volume: null,
  leverage: null,
  marginRate: null,
};

export default React.memo(MarginDebug);
