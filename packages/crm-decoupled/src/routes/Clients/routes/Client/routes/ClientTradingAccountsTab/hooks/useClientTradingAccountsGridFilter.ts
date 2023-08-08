import { Utils } from '@crm/common';
import { LabelValue } from 'types';

type UseClientTradingAccountsGridFilter = {
  platformTypes: Array<LabelValue>,
};

const useClientTradingAccountsGridFilter = (): UseClientTradingAccountsGridFilter => {
  const platformTypes = Utils.getAvailablePlatformTypes();

  return {
    platformTypes,
  };
};

export default useClientTradingAccountsGridFilter;
