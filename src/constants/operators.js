import keyMirror from 'keymirror';

const statuses = keyMirror({
  INACTIVE: null,
  ACTIVE: null,
  CLOSED: null,
});

const actions = keyMirror({
  ACTIVATE: null,
  CLOSE: null,
});

const statusesLabels = {
  [statuses.INACTIVE]: 'Inactive',
  [statuses.ACTIVE]: 'Active',
  [statuses.CLOSED]: 'Closed',
};

const statusColorNames = {
  [statuses.ACTIVE]: 'color-success',
  [statuses.INACTIVE]: 'color-default',
  [statuses.CLOSED]: 'color-danger',
};

const reasons = [
  'REASON_ONE',
  'REASON_TWO',
  'REASON_THREE',
  'REASON_FOUR',
];

const statusActions = {
  [statuses.ACTIVE]: [
    {
      action: actions.CLOSE,
      label: 'Close',
      reasons,
    },
  ],
  [statuses.CLOSED]: [
    {
      action: actions.ACTIVATE,
      label: 'Activate',
      reasons,
    },
  ],
};

export {
  actions,
  statuses,
  statusesLabels,
  statusColorNames,
  statusActions,
  reasons,
};
