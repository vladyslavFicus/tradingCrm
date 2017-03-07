import keyMirror from 'keymirror';

const statuses = keyMirror({
  INACTIVE: null,
  ACTIVE: null,
  BLOCKED: null,
  SUSPENDED: null,
});

const actions = keyMirror({
  BLOCK: null,
  UNBLOCK: null,
  SUSPEND: null,
  RESUME: null,
});

const reasons = [
  'REASON_ONE',
  'REASON_TWO',
  'REASON_THREE',
  'REASON_FOUR',
];

const statusesLabels = {
  [statuses.INACTIVE]: 'Inactive',
  [statuses.ACTIVE]: 'Active',
  [statuses.BLOCKED]: 'Blocked',
  [statuses.SUSPENDED]: 'Suspended',
};

const suspendPeriods = keyMirror({
  DAY: null,
  WEEK: null,
  MONTH: null,
  PERMANENT: null,
});

const statusActions = {
  [statuses.ACTIVE]: [
    {
      action: actions.BLOCK,
      label: 'Block',
      reasons,
    },
    {
      action: actions.SUSPEND,
      label: 'Suspend',
      reasons,
    },
  ],
  [statuses.BLOCKED]: [
    {
      action: actions.UNBLOCK,
      label: 'Unblock',
      reasons: [
        'UNBLOCK_REASON_ONE',
        'UNBLOCK_REASON_TWO',
        'UNBLOCK_REASON_THREE',
        'UNBLOCK_REASON_FOUR',
      ],
    },
  ],
};

const statusColorNames = {
  [statuses.ACTIVE]: 'color-success',
  [statuses.INACTIVE]: 'color-warning',
  [statuses.BLOCKED]: 'color-danger',
  [statuses.SUSPENDED]: 'color-secondary',
};

export {
  statuses,
  statusesLabels,
  actions,
  statusActions,
  suspendPeriods,
  statusColorNames,
};
