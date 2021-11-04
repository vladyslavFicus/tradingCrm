import React, { useEffect, useRef } from 'react';
import { withLazyStreams, LazyStream, LazyStreamSubscription } from 'rsocket';
import compose from 'compose-function';

interface SymbolPriceStreamResponse {
  symbol: string,
  ask: number,
  bid: number,
  datetime: string,
}

interface SymbolsPrices {
  [key: string]: SymbolPriceStreamResponse
}

interface Props {
  symbols: string[],
  interval: number,
  onNotify: (symbols: SymbolsPrices) => void,
  symbolsStreamRequest: LazyStream,
}

/**
 * Subscribe to ticks of prices for list of symbols and notify parent about new changes with custom interval
 *
 * @param props
 *
 * @constructor
 */
function SymbolsPricesStream(props: Props) {
  const {
    symbols,
    symbolsStreamRequest,
    interval = 500,
    onNotify = () => {},
  } = props;

  // Current symbol prices
  const symbolPrices = useRef<SymbolsPrices>({});

  // Actual subscription
  const subscription = useRef<LazyStreamSubscription | null>(null);

  // Get sorted list of symbols to execute re-subscribe if list changed
  const uniqueSymbols = [...new Set(symbols)].sort();

  // Cancel actual subscription if it exists and if symbols list is empty
  if (!uniqueSymbols.length && subscription.current) {
    subscription.current.cancel();
    subscription.current = null;
  }

  // Make interval parent notification about changes
  useEffect(() => {
    const timerID = setInterval(() => {
      // Copy object to new object to send new link to object and re-render parent if it was saved to state
      onNotify({ ...symbolPrices.current });
    }, interval);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  // Make subscription to symbol prices
  useEffect(() => {
    // Clear previous data for previous subscription
    symbolPrices.current = {};

    // Skip subscribing if symbols list is empty
    if (!uniqueSymbols.length) {
      return;
    }

    subscription.current = symbolsStreamRequest({ data: { symbols: uniqueSymbols } });

    subscription.current.onNext<SymbolPriceStreamResponse>(({ data }) => {
      symbolPrices.current[data.symbol] = data;
    });
  }, [uniqueSymbols.join()]); // Join an array to string, cause deps should be non-changeable array length

  return null;
}

export default compose(
  React.memo,
  withLazyStreams({
    symbolsStreamRequest: {
      route: 'streamAllSymbolPrices',
    },
  }),
)(SymbolsPricesStream);
