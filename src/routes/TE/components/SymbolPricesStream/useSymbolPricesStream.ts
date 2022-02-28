import { useSymbolsPricesStream } from '../SymbolsPricesStream';
import { SymbolPrice } from './SymbolPricesStream';

const useSymbolPricesStream = (symbol: string | null | undefined): SymbolPrice | null => {
  const prices = useSymbolsPricesStream([symbol]);

  const result = symbol ? prices[symbol] : null;

  return result || null;
};

export default useSymbolPricesStream;
