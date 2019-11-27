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

const statusColorNames = {
  [statuses.ACTIVE]: 'color-success',
  [statuses.INACTIVE]: 'color-default',
  [statuses.CLOSED]: 'color-danger',
};

const closeReasons = {
  'PARTNER_PROFILE.CLOSE_REASONS.PENDING_INVESTIGATION':
    'PARTNER_PROFILE.CLOSE_REASONS.PENDING_INVESTIGATION',
  'PARTNER_PROFILE.CLOSE_REASONS.TERMINATED':
    'PARTNER_PROFILE.CLOSE_REASONS.TERMINATED',
};

const activeReasons = {
  'PARTNER_PROFILE.ACTIVATE_REASONS.ACTIVATE':
    'PARTNER_PROFILE.ACTIVATE_REASONS.ACTIVATE',
};

const statusActions = {
  [statuses.ACTIVE]: [
    {
      action: actions.CLOSED,
      label: 'Close',
      reasons: closeReasons,
    },
  ],
  [statuses.CLOSED]: [
    {
      action: actions.ACTIVE,
      label: 'Activate',
      reasons: activeReasons,
    },
  ],
};

export {
  statusColorNames,
  statusesLabels,
  statusActions,
  statuses,
};
