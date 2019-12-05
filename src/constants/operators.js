import keyMirror from 'keymirror';

const statuses = keyMirror({
  ACTIVE: null,
  CLOSED: null,
  INACTIVE: null,
});

const actions = keyMirror({
  ACTIVE: null,
  CLOSED: null,
});

const statusesLabels = {
  [statuses.ACTIVE]: 'OPERATORS.STATUSES.ACTIVE',
  [statuses.CLOSED]: 'OPERATORS.STATUSES.CLOSED',
  [statuses.INACTIVE]: 'OPERATORS.STATUSES.INACTIVE',
};

const statusColorNames = {
  [statuses.ACTIVE]: 'color-success',
  [statuses.CLOSED]: 'color-danger',
  [statuses.INACTIVE]: 'color-default',
};

const closeReasons = {
  'OPERATOR_PROFILE.CLOSE_REASONS.PENDING_INVESTIGATION':
    'OPERATOR_PROFILE.CLOSE_REASONS.PENDING_INVESTIGATION',
  'OPERATOR_PROFILE.CLOSE_REASONS.TERMINATED':
    'OPERATOR_PROFILE.CLOSE_REASONS.TERMINATED',
};

const activeReasons = {
  'OPERATOR_PROFILE.ACTIVATE_REASONS.ACTIVATE':
    'OPERATOR_PROFILE.ACTIVATE_REASONS.ACTIVATE',
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

const departments = keyMirror({
  ADMINISTRATION: null,
  AFFILIATE_MANAGER: null,
  AFFILIATE_PARTNER: null,
  PLAYER: null,
  CS: null,
  BI: null,
  E2E: null,
  IGROMAT: null,
  MARKETING: null,
  RETENTION: null,
  RFP: null,
  SALES: null,
  FINANCE: null,
  COMPLIANCE: null,
  DEALING: null,
});

const departmentsLabels = {
  [departments.ADMINISTRATION]: 'CONSTANTS.OPERATORS.DEPARTMENTS.ADMINISTRATION',
  [departments.AFFILIATE_MANAGER]: 'CONSTANTS.OPERATORS.DEPARTMENTS.AFFILIATE_MANAGER',
  [departments.AFFILIATE_PARTNER]: 'CONSTANTS.OPERATORS.DEPARTMENTS.AFFILIATE_PARTNER',
  [departments.PLAYER]: 'CONSTANTS.OPERATORS.DEPARTMENTS.PLAYER',
  [departments.CS]: 'CONSTANTS.OPERATORS.DEPARTMENTS.CS',
  [departments.BI]: 'CONSTANTS.OPERATORS.DEPARTMENTS.BI',
  [departments.E2E]: 'CONSTANTS.OPERATORS.DEPARTMENTS.E2E',
  [departments.IGROMAT]: 'CONSTANTS.OPERATORS.DEPARTMENTS.IGROMAT',
  [departments.MARKETING]: 'CONSTANTS.OPERATORS.DEPARTMENTS.MARKETING',
  [departments.RETENTION]: 'CONSTANTS.OPERATORS.DEPARTMENTS.RETENTION',
  [departments.RFP]: 'CONSTANTS.OPERATORS.DEPARTMENTS.RFP',
  [departments.SALES]: 'CONSTANTS.OPERATORS.DEPARTMENTS.SALES',
  [departments.FINANCE]: 'CONSTANTS.OPERATORS.DEPARTMENTS.FINANCE',
  [departments.COMPLIANCE]: 'CONSTANTS.OPERATORS.DEPARTMENTS.COMPLIANCE',
  [departments.DEALING]: 'CONSTANTS.OPERATORS.DEPARTMENTS.DEALING',
};

const roles = keyMirror({
  ROLE1: null,
  ROLE2: null,
  ROLE3: null,
  ROLE4: null,
  PLAYER: null,
});

const rolesLabels = {
  [roles.ROLE1]: 'CONSTANTS.OPERATORS.ROLES.ROLE1',
  [roles.ROLE2]: 'CONSTANTS.OPERATORS.ROLES.ROLE2',
  [roles.ROLE3]: 'CONSTANTS.OPERATORS.ROLES.ROLE3',
  [roles.ROLE4]: 'CONSTANTS.OPERATORS.ROLES.ROLE4',
  [roles.PLAYER]: 'CONSTANTS.OPERATORS.ROLES.PLAYER',
};

const operatorTypes = keyMirror({
  OPERATOR: null,
  PARTNER: null,
});

export {
  actions,
  statuses,
  statusesLabels,
  statusColorNames,
  statusActions,
  departments,
  departmentsLabels,
  roles,
  rolesLabels,
  operatorTypes,
};
