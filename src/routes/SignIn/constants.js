import keyMirror from 'keymirror';
import I18n from '../../utils/fake-i18n';

const brands = keyMirror({
  hrzn: null,
  vulcanprestige: null,
  redbox: null,
  loki: null,
});
const departments = keyMirror({
  ADMINISTRATION: null,
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
  [brands.hrzn]: {
    name: 'Horizon',
    image: { src: '/img/nascasino-brand-logo.png' },
  },
  [brands.vulcanprestige]: {
    name: 'Vulcan Prestige',
    image: { src: '/img/vulcanprestige_brand_logo.png', style: { width: '120px' } },
  },
  [brands.loki]: {
    name: 'Loki',
    image: { src: '/img/loki-brand-logo.svg' },
  },
  [brands.redbox]: {
    name: 'Redbox',
    image: { src: '/img/redbox_brand_logo.svg', style: { width: '160px' } },
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
  [departments.ADMINISTRATION]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.ADMINISTRATION'),
    image: '/img/administration_dep_logo.svg',
  },
};
const rolesConfig = {
  [roles.ROLE1]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE1'),
  [roles.ROLE2]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE2'),
  [roles.ROLE3]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE3'),
  [roles.ROLE4]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE4'),
};

export { brands, departments, roles, brandsConfig, departmentsConfig, rolesConfig };
