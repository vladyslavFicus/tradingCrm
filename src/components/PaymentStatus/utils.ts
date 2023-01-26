import enumToArray from 'utils/enumToArray';
import { statuses, statusMapper, statusesLabels } from 'constants/payment';

// find correspond status and return Object in following structure - { status, label }
export const getTradingStatusProps = (tradingStatus: string) => {
  const status = enumToArray(statuses).find((statusName) => {
    if (statusMapper[statusName].find(item => item === tradingStatus)) {
      return true;
    }

    return false;
  });

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
