import keyMirror from 'keymirror';
import I18n from '../../utils/fake-i18n';

const brands = keyMirror({
  hrzn_dev2: null,
  vslots_prod: null,
  hrzn_stage: null,
});
const departments = keyMirror({
  CS: null,
  RFP: null,
  MARKETING: null,
});
const roles = keyMirror({
  ROLE1: null,
  ROLE2: null,
  ROLE3: null,
  ROLE4: null,
});

const brandsConfig = {
  [brands.hrzn_dev2]: {
    name: 'Horizon',
    image: '/img/nascasino-brand-logo.png',
  },
  [brands.vslots_prod]: {
    name: 'Vslots',
    image: '/img/nascasino-brand-logo.png',
  },
  [brands.hrzn_stage]: {
    name: 'Stage',
    image: '/img/nascasino-brand-logo.png',
  },
};
const departmentsConfig = {
  [departments.CS]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.CS'),
    image: '/img/cs-dep-icon.svg',
  },
  [departments.RFP]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.RFP'),
    image: '/img/rfp-dep-logo.svg',
  },
  [departments.MARKETING]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.MARKETING'),
    image: '/img/casino-crm-dep-logo.svg',
  },
};
const rolesConfig = {
  [roles.ROLE1]: { name: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE1') },
  [roles.ROLE2]: { name: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE2') },
  [roles.ROLE3]: { name: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE3') },
  [roles.ROLE4]: { name: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE4') },
};

export { brands, departments, roles, brandsConfig, departmentsConfig, rolesConfig };
