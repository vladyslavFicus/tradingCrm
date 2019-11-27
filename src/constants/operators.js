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
  [statuses.INACTIVE]: 'OPERATORS.STATUSES.INACTIVE',
  [statuses.ACTIVE]: 'OPERATORS.STATUSES.ACTIVE',
  [statuses.CLOSED]: 'OPERATORS.STATUSES.CLOSED',
};

const statusColorNames = {
  [statuses.ACTIVE]: 'color-success',
  [statuses.INACTIVE]: 'color-default',
  [statuses.CLOSED]: 'color-danger',
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
  CS: null,
  RFP: null,
  MARKETING: null,
  ADMINISTRATION: null,
  SALES: null,
  RETENTION: null,
  AFFILIATE_PARTNER: null,
  AFFILIATE_MANAGER: null,
});

const departmentsLabels = {
  [departments.CS]: 'CONSTANTS.OPERATORS.DEPARTMENTS.CS',
  [departments.RFP]: 'CONSTANTS.OPERATORS.DEPARTMENTS.RFP',
  [departments.MARKETING]: 'CONSTANTS.OPERATORS.DEPARTMENTS.MARKETING',
  [departments.ADMINISTRATION]: 'CONSTANTS.OPERATORS.DEPARTMENTS.ADMINISTRATION',
  [departments.E2E]: 'CONSTANTS.OPERATORS.DEPARTMENTS.E2E',
  [departments.BI]: 'CONSTANTS.OPERATORS.DEPARTMENTS.BI',
  [departments.IGROMAT]: 'CONSTANTS.OPERATORS.DEPARTMENTS.IGROMAT',
  [departments.SALES]: 'CONSTANTS.OPERATORS.DEPARTMENTS.SALES',
  [departments.RETENTION]: 'CONSTANTS.OPERATORS.DEPARTMENTS.RETENTION',
};

const roles = keyMirror({
  ROLE1: null,
  ROLE2: null,
  ROLE3: null,
  ROLE4: null,
});

const rolesLabels = {
  [roles.ROLE1]: 'CONSTANTS.OPERATORS.ROLES.ROLE1',
  [roles.ROLE2]: 'CONSTANTS.OPERATORS.ROLES.ROLE2',
  [roles.ROLE3]: 'CONSTANTS.OPERATORS.ROLES.ROLE3',
  [roles.ROLE4]: 'CONSTANTS.OPERATORS.ROLES.ROLE4',
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
