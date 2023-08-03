import { getAvailablePlatformTypes } from 'utils/tradingAccount';

const useTradingAccountsFilters = () => {
  const platformTypes = getAvailablePlatformTypes();

  return {
    platformTypes,
  };
};

export default useTradingAccountsFilters;
