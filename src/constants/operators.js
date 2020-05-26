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
  DIDLOGIC_OPERATOR: null,
  CELLEXPERT_OPERATOR: null,
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
  [departments.DIDLOGIC_OPERATOR]: 'CONSTANTS.OPERATORS.DEPARTMENTS.DIDLOGIC_OPERATOR',
  [departments.CELLEXPERT_OPERATOR]: 'CONSTANTS.OPERATORS.DEPARTMENTS.CELLEXPERT_OPERATOR',
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
  EXECUTIVE: null,
  TEAM_LEADER: null,
  MANAGER: null,
  HEAD_OF_DEPARTMENT: null,
  MARKETING: null,
  COMPLIANCE: null,
  E2E: null,
  BI: null,
  AFFILIATE: null,
  PLAYER: null,
});

const rolesLabels = {
  [roles.EXECUTIVE]: 'CONSTANTS.OPERATORS.ROLES.EXECUTIVE',
  [roles.TEAM_LEADER]: 'CONSTANTS.OPERATORS.ROLES.TEAM_LEADER',
  [roles.MANAGER]: 'CONSTANTS.OPERATORS.ROLES.MANAGER',
  [roles.HEAD_OF_DEPARTMENT]: 'CONSTANTS.OPERATORS.ROLES.HEAD_OF_DEPARTMENT',
  [roles.MARKETING]: 'CONSTANTS.OPERATORS.ROLES.MARKETING',
  [roles.COMPLIANCE]: 'CONSTANTS.OPERATORS.ROLES.COMPLIANCE',
  [roles.E2E]: 'CONSTANTS.OPERATORS.ROLES.E2E',
  [roles.BI]: 'CONSTANTS.OPERATORS.ROLES.BI',
  [roles.AFFILIATE]: 'CONSTANTS.OPERATORS.ROLES.AFFILIATE',
  [roles.PLAYER]: 'CONSTANTS.OPERATORS.ROLES.PLAYER',
};

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
};
