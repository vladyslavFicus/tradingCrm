import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const brands = keyMirror({
  hrzn: null,
  vulcanprestige: null,
  redbox: null,
  slottica: null,
  loki: null,
  vulcanneon: null,
  vulcangold: null,
  gslots: null,
  cerberus: null,
  casino_999_dk: null,
});
const departments = keyMirror({
  ADMINISTRATION: null,
  CS: null,
  RFP: null,
  MARKETING: null,
  BI: null,
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
    image: { src: '/img/brand/image/nascasino.png' },
  },
  [brands.vulcanprestige]: {
    name: 'Vulcan Prestige',
    image: { src: '/img/brand/image/vulcanprestige.png' },
  },
  [brands.loki]: {
    name: 'Loki',
    image: { src: '/img/brand/image/loki.svg' },
  },
  [brands.redbox]: {
    name: 'Redbox',
    image: { src: '/img/brand/image/redbox.svg' },
  },
  [brands.slottica]: {
    name: 'Slottica',
    image: { src: '/img/brand/image/slottica.svg' },
  },
  [brands.vulcanneon]: {
    name: 'Vulcan neon',
    image: { src: '/img/brand/image/vulcanneon.jpg' },
  },
  [brands.vulcangold]: {
    name: 'Vulcan gold',
    image: { src: '/img/brand/image/vulcangold.svg' },
  },
  [brands.gslots]: {
    name: 'Gslots',
    image: { src: '/img/brand/image/gslots.svg' },
  },
  [brands.cerberus]: {
    name: 'Cerberus',
    image: { src: '/img/brand/image/cerberus.svg' },
  },
  [brands.casino_999_dk]: {
    name: 'Casino999DK',
    image: { src: '/img/brand/image/casino_999_dk.svg' },
  },
};
const departmentsConfig = {
  [departments.CS]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.CS'),
    image: '/img/departments/cs-dep-icon.svg',
  },
  [departments.RFP]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.RFP'),
    image: '/img/departments/rfp-dep-logo.svg',
  },
  [departments.MARKETING]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.MARKETING'),
    image: '/img/departments/casino-crm-dep-logo.svg',
  },
  [departments.ADMINISTRATION]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.ADMINISTRATION'),
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.BI]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.BI'),
    image: '/img/departments/bi-crm-dep-logo.svg',
  },
};
const rolesConfig = {
  [roles.ROLE1]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE1'),
  [roles.ROLE2]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE2'),
  [roles.ROLE3]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE3'),
  [roles.ROLE4]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE4'),
};

export { brands, departments, roles, brandsConfig, departmentsConfig, rolesConfig };
