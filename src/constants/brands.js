import keyMirror from 'keymirror';

const departments = keyMirror({
  ADMINISTRATION: null,
  CS: null,
  RFP: null,
  MARKETING: null,
  BI: null,
  SALES: null,
  RETENTION: null,
  DEALING: null,
  COMPLIANCE: null,
  FINANCE: null,
});

const roles = keyMirror({
  ROLE1: null,
  ROLE2: null,
  ROLE3: null,
  ROLE4: null,
});

const departmentsConfig = {
  [departments.CS]: {
    name: 'CONSTANTS.SIGN_IN.DEPARTMENTS.CS',
    image: '/img/departments/cs-dep-icon.svg',
  },
  [departments.RFP]: {
    name: 'CONSTANTS.SIGN_IN.DEPARTMENTS.RFP',
    image: '/img/departments/rfp-dep-logo.svg',
  },
  [departments.MARKETING]: {
    name: 'CONSTANTS.SIGN_IN.DEPARTMENTS.MARKETING',
    image: '/img/departments/casino-crm-dep-logo.svg',
  },
  [departments.ADMINISTRATION]: {
    name: 'CONSTANTS.SIGN_IN.DEPARTMENTS.ADMINISTRATION',
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.BI]: {
    name: 'CONSTANTS.SIGN_IN.DEPARTMENTS.BI',
    image: '/img/departments/bi-crm-dep-logo.svg',
  },
  [departments.E2E]: {
    name: 'CONSTANTS.SIGN_IN.DEPARTMENTS.E2E',
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.IGROMAT]: {
    name: 'CONSTANTS.SIGN_IN.DEPARTMENTS.IGROMAT',
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.SALES]: {
    name: 'CONSTANTS.SIGN_IN.DEPARTMENTS.SALES',
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.RETENTION]: {
    name: 'CONSTANTS.SIGN_IN.DEPARTMENTS.RETENTION',
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.DEALING]: {
    name: 'CONSTANTS.SIGN_IN.DEPARTMENTS.DEALING',
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.COMPLIANCE]: {
    name: 'CONSTANTS.SIGN_IN.DEPARTMENTS.COMPLIANCE',
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.FINANCE]: {
    name: 'CONSTANTS.SIGN_IN.DEPARTMENTS.FINANCE',
    image: '/img/departments/administration_dep_logo.svg',
  },
};
const rolesConfig = {
  [roles.ROLE1]: 'CONSTANTS.OPERATORS.ROLES.ROLE1',
  [roles.ROLE2]: 'CONSTANTS.OPERATORS.ROLES.ROLE2',
  [roles.ROLE3]: 'CONSTANTS.OPERATORS.ROLES.ROLE3',
  [roles.ROLE4]: 'CONSTANTS.OPERATORS.ROLES.ROLE4',
};

export { departments, roles, departmentsConfig, rolesConfig };
