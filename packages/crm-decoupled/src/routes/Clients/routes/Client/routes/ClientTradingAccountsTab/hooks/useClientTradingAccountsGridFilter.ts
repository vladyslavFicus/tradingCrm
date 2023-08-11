import { Utils, Types } from '@crm/common';

type UseClientTradingAccountsGridFilter = {
  platformTypes: Array<Types.LabelValue>,
};

const useClientTradingAccountsGridFilter = (): UseClientTradingAccountsGridFilter => {
  const platformTypes = Utils.getAvailablePlatformTypes();

  return {
    platformTypes,
  };
};

export default useClientTradingAccountsGridFilter;
