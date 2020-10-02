import keyMirror from 'keymirror';

const statuses = keyMirror({
  ACTIVE: null,
  INACTIVE: null,
});

const clientDistributionStatuses = {
  [statuses.ACTIVE]: {
    label: 'CLIENTS_DISTRIBUTION.STATUSES.ACTIVE',
    color: 'color-success',
  },
  [statuses.INACTIVE]: {
    label: 'CLIENTS_DISTRIBUTION.STATUSES.INACTIVE',
    color: 'color-default',
  },
};

const statusesLabels = {
  [statuses.ACTIVE]: 'CLIENTS_DISTRIBUTION.STATUSES.ACTIVE',
  [statuses.INACTIVE]: 'CLIENTS_DISTRIBUTION.STATUSES.INACTIVE',
};

const executionTime = [
  {
    value: 1,
  },
  {
    value: 2,
  },
  {
    value: 3,
  },
];

export {
  statuses,
  executionTime,
  statusesLabels,
  clientDistributionStatuses,
};
