import React, { useEffect } from 'react';
import { withLazyStreams, LazyStream } from 'rsocket';
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

const symbolPrices: SymbolsPrices = {};

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

  // Get sorted list of symbols to execute re-subscribe if list changed
  const uniqueSymbols = [...new Set(symbols)].sort();

  // Skip subscribing if symbols list is empty
  if (!uniqueSymbols.length) {
    return null;
  }

  // Make interval parent notification about changes
  useEffect(() => {
    const timerID = setInterval(() => {
      // Copy object to new object to send new link to object and re-render parent if it was saved to state
      onNotify({ ...symbolPrices });
    }, interval);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  // Make subscription to symbol prices
  useEffect(() => {
    const subscription = symbolsStreamRequest({ data: { symbols: uniqueSymbols } });

    subscription.onNext<SymbolPriceStreamResponse>(({ data }) => {
      symbolPrices[data.symbol] = data;
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
