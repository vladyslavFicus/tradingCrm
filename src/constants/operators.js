import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

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
  [statuses.INACTIVE]: I18n.t('OPERATORS.STATUSES.INACTIVE'),
  [statuses.ACTIVE]: I18n.t('OPERATORS.STATUSES.ACTIVE'),
  [statuses.CLOSED]: I18n.t('OPERATORS.STATUSES.CLOSED'),
};

const statusColorNames = {
  [statuses.ACTIVE]: 'color-success',
  [statuses.INACTIVE]: 'color-default',
  [statuses.CLOSED]: 'color-danger',
};

const closeReasons = {
  'OPERATOR_PROFILE.CLOSE_REASONS.PENDING_INVESTIGATION':
    I18n.t('OPERATOR_PROFILE.CLOSE_REASONS.PENDING_INVESTIGATION'),
  'OPERATOR_PROFILE.CLOSE_REASONS.TERMINATED':
    I18n.t('OPERATOR_PROFILE.CLOSE_REASONS.TERMINATED'),
};

const activeReasons = {
  'OPERATOR_PROFILE.ACTIVATE_REASONS.ACTIVATE':
    I18n.t('OPERATOR_PROFILE.ACTIVATE_REASONS.ACTIVATE'),
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
  [departments.CS]: I18n.t('CONSTANTS.OPERATORS.DEPARTMENTS.CS'),
  [departments.RFP]: I18n.t('CONSTANTS.OPERATORS.DEPARTMENTS.RFP'),
  [departments.MARKETING]: I18n.t('CONSTANTS.OPERATORS.DEPARTMENTS.MARKETING'),
  [departments.ADMINISTRATION]: I18n.t('CONSTANTS.OPERATORS.DEPARTMENTS.ADMINISTRATION'),
  [departments.E2E]: I18n.t('CONSTANTS.OPERATORS.DEPARTMENTS.E2E'),
  [departments.BI]: I18n.t('CONSTANTS.OPERATORS.DEPARTMENTS.BI'),
  [departments.IGROMAT]: I18n.t('CONSTANTS.OPERATORS.DEPARTMENTS.IGROMAT'),
  [departments.SALES]: I18n.t('CONSTANTS.OPERATORS.DEPARTMENTS.SALES'),
  [departments.RETENTION]: I18n.t('CONSTANTS.OPERATORS.DEPARTMENTS.RETENTION'),
};

const roles = keyMirror({
  ROLE1: null,
  ROLE2: null,
  ROLE3: null,
  ROLE4: null,
});

const rolesLabels = {
  [roles.ROLE1]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE1'),
  [roles.ROLE2]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE2'),
  [roles.ROLE3]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE3'),
  [roles.ROLE4]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE4'),
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
