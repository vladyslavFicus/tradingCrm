import { Utils } from '@crm/common';
import { statuses, statusMapper, statusesLabels } from 'constants/payment';

// find correspond status and return Object in following structure - { status, label }
export const getTradingStatusProps = (tradingStatus: string) => {
  const status = Utils.enumToArray(statuses).find(
    statusName => statusMapper[statusName].find(
      item => item === tradingStatus,
    ),
  );

  if (status) {
    return {
      status,
      label: statusesLabels[status],
    };
  }

  return {
    status: tradingStatus,
    label: tradingStatus,
  };
};
