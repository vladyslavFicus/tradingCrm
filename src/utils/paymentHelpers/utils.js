import {
  statusMapper,
  statusesColor,
  statusesLabels,
} from 'constants/payment';
import renderLabel from '../renderLabel';

const revertedMapper = Object.entries(statusMapper);

// find correspond status and return Object in following structure - { color, label }
export const getTradingStatusProps = (status) => {
  let statusName = null;

  revertedMapper.some(([key, array]) => {
    if (array.find(item => item === status)) {
      statusName = key;

      return true;
    }

    return false;
  });

  return {
    status: statusName,
    label: renderLabel(statusName, statusesLabels),
    color: statusesColor[statusName],
  };
};
