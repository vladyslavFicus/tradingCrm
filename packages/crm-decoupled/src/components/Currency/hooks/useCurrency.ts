import { currencySettings } from '../constants';

const useCurrency = (code: string) => {
  const symbol = currencySettings[code] ? currencySettings[code].symbol : code;

  return symbol;
};

export default useCurrency;
