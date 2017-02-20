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

export {
  statuses,
  actions,
  statusActions,
  suspendPeriods,
};
