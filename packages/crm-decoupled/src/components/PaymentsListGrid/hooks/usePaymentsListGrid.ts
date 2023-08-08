import { Config } from '@crm/common';

const usePaymentsListGrid = () => {
  const columnsOrder = Config.getBackofficeBrand()?.tables?.payments?.columnsOrder || [];

  return { columnsOrder };
};

export default usePaymentsListGrid;
