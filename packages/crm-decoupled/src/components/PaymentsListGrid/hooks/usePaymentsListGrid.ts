import { getBackofficeBrand } from 'config';

const usePaymentsListGrid = () => {
  const columnsOrder = getBackofficeBrand()?.tables?.payments?.columnsOrder || [];

  return { columnsOrder };
};

export default usePaymentsListGrid;
