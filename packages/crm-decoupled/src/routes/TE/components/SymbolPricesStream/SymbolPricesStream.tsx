import React, { useEffect, useRef } from 'react';
import compose from 'compose-function';
import { withLazyStreams, LazyStream } from 'rsocket';

export interface SymbolPrice {
  symbol: string,
  ask: number,
  bid: number,
  datetime: string,
  pnlRates: { [currency: string]: number },
  marginRates: { [currency: string]: number },
}

type Props = {
  symbol: string,
  interval: number,
  onNotify: (symbol: SymbolPrice) => void,
  symbolsStreamRequest: LazyStream,
}

/**
 * Subscribe to ticks of prices for one symbol and notify parent about new changes with custom interval
 *
 * @param props
 *
 * @constructor
 */
function SymbolPricesStream(props: Props) {
  const {
    symbol,
    symbolsStreamRequest,
    interval = 500,
    onNotify = () => {},
  } = props;

  // Skip subscribing if symbol is empty
  if (!symbol) {
    return null;
  }

  const symbolPrice = useRef<SymbolPrice | null>(null);

  // Make interval parent notification about changes
  useEffect(() => {
    const timerID = setInterval(() => {
      // Notify only if price exist
      if (symbolPrice.current) {
        onNotify(symbolPrice.current);
      }
    }, interval);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  // Make subscription to symbol prices
  useEffect(() => {
    // Clear previous data for previous subscription
    symbolPrice.current = null;

    const subscription = symbolsStreamRequest({ data: { symbols: [symbol] } });

    subscription.onNext<SymbolPrice>(({ data }) => {
      symbolPrice.current = data;
    });
  }, [symbol]);

  return null;
}

export default compose(
  React.memo,
  withLazyStreams({
    symbolsStreamRequest: {
      route: 'streamAllSymbolPrices',
    },
  }),
)(SymbolPricesStream);
