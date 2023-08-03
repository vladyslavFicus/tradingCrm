import { LabelValue } from 'types';
import { getAvailablePlatformTypes } from 'utils/tradingAccount';

type UseClientTradingAccountsGridFilter = {
  platformTypes: Array<LabelValue>,
};

const useClientTradingAccountsGridFilter = (): UseClientTradingAccountsGridFilter => {
  const platformTypes = getAvailablePlatformTypes();

  return {
    platformTypes,
  };
};

export default useClientTradingAccountsGridFilter;
