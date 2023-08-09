import { Utils } from '@crm/common';

const useTradingAccountsFilters = () => {
  const platformTypes = Utils.getAvailablePlatformTypes();

  return {
    platformTypes,
  };
};

export default useTradingAccountsFilters;
