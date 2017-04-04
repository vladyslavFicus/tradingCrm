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
      action: actions.CLOSED,
      label: 'Close',
      reasons,
    },
  ],
  [statuses.CLOSED]: [
    {
      action: actions.ACTIVE,
      label: 'Activate',
      reasons,
    },
  ],
};

const departments = keyMirror({
  CS: null,
  RFP: null,
  MARKETING: null,
});
const departmentsLabels = {
  [departments.CS]: 'Customer service',
  [departments.RFP]: 'Risk Fraud & Payment',
  [departments.MARKETING]: 'Marketing',
};
const roles = keyMirror({
  ROLE1: null,
  ROLE2: null,
  ROLE3: null,
  ROLE4: null,
});
const rolesLabels = {
  [roles.ROLE1]: 'Executive',
  [roles.ROLE2]: 'Team Leader',
  [roles.ROLE3]: 'Manager',
  [roles.ROLE4]: 'Head of department',
};

export {
  actions,
  statuses,
  statusesLabels,
  statusColorNames,
  statusActions,
  reasons,
  departments,
  departmentsLabels,
  roles,
  rolesLabels,
};
