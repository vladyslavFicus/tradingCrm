import keyMirror from 'keymirror';

const statuses = keyMirror({
  INACTIVE: null,
  ACTIVE: null,
  CLOSED: null,
});

const actions = keyMirror({
  ACTIVE: null,
  CLOSED: null,
});

const statusesLabels = {
  [statuses.INACTIVE]: 'PARTNERS.STATUSES.INACTIVE',
  [statuses.ACTIVE]: 'PARTNERS.STATUSES.ACTIVE',
  [statuses.CLOSED]: 'PARTNERS.STATUSES.CLOSED',
};

const closeReasons = {
  'PARTNER_PROFILE.CLOSE_REASONS.PENDING_INVESTIGATION': 'PARTNER_PROFILE.CLOSE_REASONS.PENDING_INVESTIGATION',
  'PARTNER_PROFILE.CLOSE_REASONS.TERMINATED': 'PARTNER_PROFILE.CLOSE_REASONS.TERMINATED',
};

const activeReasons = {
  'PARTNER_PROFILE.ACTIVATE_REASONS.ACTIVATE': 'PARTNER_PROFILE.ACTIVATE_REASONS.ACTIVATE',
};

const statusActions = [
  {
    status: statuses.ACTIVE,
    action: actions.ACTIVE,
    label: 'COMMON.ACTIVATE',
    reasons: activeReasons,
  },
  {
    status: statuses.CLOSED,
    action: actions.CLOSED,
    label: 'COMMON.CLOSE',
    reasons: closeReasons,
  },
];

export {
  statusesLabels,
  statusActions,
  statuses,
};
