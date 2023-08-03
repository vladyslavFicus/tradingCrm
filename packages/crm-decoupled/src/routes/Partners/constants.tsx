export enum statuses {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export enum actionStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export const statusesLabels = {
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

export const statusActions = [
  {
    status: statuses.ACTIVE,
    action: actionStatus.ACTIVE,
    label: 'COMMON.ACTIVATE',
    reasons: activeReasons,
  },
  {
    status: statuses.CLOSED,
    action: actionStatus.CLOSED,
    label: 'COMMON.CLOSE',
    reasons: closeReasons,
  },
];
