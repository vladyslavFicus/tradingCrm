import React from 'react';
import TradingViewWidget from '../TradingViewWidget';

const ScreenerWidgetSRC = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
const ScreenerOptions = JSON.stringify({
  width: '100%',
  height: 523,
  defaultColumn: 'overview',
  defaultScreen: 'general',
  market: 'forex',
  showToolbar: true,
  colorTheme: 'light',
  locale: 'en',
});

const ScreenerWidget = () => (
  <TradingViewWidget
    optionsWidget={{
      src: ScreenerWidgetSRC,
      options: ScreenerOptions,
    }}
    initScriptId="ScreenerWidget"
  />
);

export default ScreenerWidget;
