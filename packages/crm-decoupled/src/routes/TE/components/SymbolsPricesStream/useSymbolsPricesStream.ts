import { useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import { LazyStreamSubscription, useRsocket } from '@crm/common';

interface SymbolPriceStreamResponse {
  symbol: string,
  ask: number,
  bid: number,
  datetime: string,
  pnlRates: { [currency: string]: number },
  marginRates: { [currency: string]: number },
}

export interface SymbolsPrices {
  [key: string]: SymbolPriceStreamResponse | undefined,
}

const useSymbolsPricesStream = (symbols: (string | null | undefined)[]) => {
  const rsocket = useRsocket();

  // Current symbol prices
  const [symbolPrices, setSymbolPrices] = useState<SymbolsPrices>({});

  // Actual subscription
  const subscription = useRef<LazyStreamSubscription | null>(null);

  // Save symbol prices to variable each tick and save to state only with throttle to delayed update components
  const currentSymbolPrices = useRef<SymbolsPrices>({});

  // Get sorted list of non-nullable symbols to execute re-subscribe if list changed
  const uniqueSymbols = [...new Set(symbols)].filter(symbol => !!symbol).sort();

  // Cancel subscription handler
  const cancelSubscription = () => {
    if (subscription.current) {
      subscription.current.cancel();
      subscription.current = null;
    }
  };

  // Cancel actual subscription if symbols list is empty
  if (!uniqueSymbols.length) {
    cancelSubscription();
  }

  // Make subscription to symbol prices
  useEffect(() => {
    // Cancel actual subscription to resubscribe to new data
    cancelSubscription();

    // Subscribing only if symbols list is not empty
    if (uniqueSymbols.length) {
      // Need create new object when set symbol prices to re-render components with new data
      const saveToState = throttle(() => {
        // Save to state only with active subscription to avoiding saving to state when component already unmounted
        if (subscription.current) {
          setSymbolPrices({ ...currentSymbolPrices.current });
        }
      }, 500, { leading: false });

      rsocket
        .route('streamAllSymbolPrices')
        .requestStream({
          data: { symbols: uniqueSymbols },
          metadata: {},
        })
        .subscribe({
          onNext: (({ data }: any) => {
            currentSymbolPrices.current[data.symbol] = data;

            saveToState();
          }),
          onSubscribe: (_subscription: any) => {
            subscription.current = _subscription;

            _subscription.request(Number.MAX_SAFE_INTEGER);
          },
        });
    }

    return () => {
      // Cancel subscription when component unmounted
      cancelSubscription();
    };
  }, [uniqueSymbols.join()]); // Join an array to string, cause deps should be non-changeable array length

  return symbolPrices;
};

export default useSymbolsPricesStream;
