import { Utils, Constants } from '@crm/common';

// find correspond status and return Object in following structure - { status, label }
export const getTradingStatusProps = (tradingStatus: string) => {
  const status = Utils.enumToArray(Constants.Payment.statuses).find(
    statusName => Constants.Payment.statusMapper[statusName].find(
      item => item === tradingStatus,
    ),
  );

  if (status) {
    return {
      status,
      label: Constants.Payment.statusesLabels[status],
    };
  }

  return {
    status: tradingStatus,
    label: tradingStatus,
  };
};
