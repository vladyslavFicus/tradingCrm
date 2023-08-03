import { useMemo } from 'react';
import { getTradingStatusProps } from '../utils/utils';

const usePaymentStatus = (_status: string) => {
  const { status, label } = useMemo(() => getTradingStatusProps(_status), [_status]);

  return { status, label };
};

export default usePaymentStatus;
