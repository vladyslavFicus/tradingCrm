import React, { useEffect } from 'react';
import useScript from 'hooks/useScript';

type OptionsType = {
  src?: string,
  options?: string,
}

type Props = {
  optionsWidget: OptionsType,
  initScriptId: string,
};

const TradingViewWidget = (props: Props) => {
  const {
    optionsWidget,
    initScriptId,
  } = props;

  const script = useScript(initScriptId);

  useEffect(() => {
    script.initScript(optionsWidget);
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div id={initScriptId} />
    </div>
  );
};

export default React.memo(TradingViewWidget);
