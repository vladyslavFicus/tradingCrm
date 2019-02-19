import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const brands = keyMirror({
  nasfx: null,
  cryptomb: null,
  bycrypto: null,
  snpbrokers: null,
  rbctrade: null,
});
const departments = keyMirror({
  ADMINISTRATION: null,
  CS: null,
  RFP: null,
  MARKETING: null,
  BI: null,
  E2E: null,
  IGROMAT: null,
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

const brandsConfig = {
  [brands.cryptomb]: {
    name: 'Cryptomb',
    image: { src: '/img/brand/choose-brand/cryptomb.svg' },
  },
  [brands.nasfx]: {
    name: 'Nasfx',
    image: { src: '/img/brand/choose-brand/nasfx.svg' },
  },
  [brands.bycrypto]: {
    name: 'Bycrypto',
    image: { src: '/img/brand/choose-brand/bycrypto.svg' },
  },
  [brands.snpbrokers]: {
    name: 'Snpbrokers',
    image: { src: '/img/brand/choose-brand/snpbrokers.svg' },
  },
  [brands.rbctrade]: {
    name: 'RBCtrade',
    image: { src: '/img/brand/choose-brand/rbctrade.svg' },
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
  [departments.E2E]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.E2E'),
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.IGROMAT]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.IGROMAT'),
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.SALES]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.SALES'),
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.RETENTION]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.RETENTION'),
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.DEALING]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.DEALING'),
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.COMPLIANCE]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.COMPLIANCE'),
    image: '/img/departments/administration_dep_logo.svg',
  },
  [departments.FINANCE]: {
    name: I18n.t('CONSTANTS.SIGN_IN.DEPARTMENTS.FINANCE'),
    image: '/img/departments/administration_dep_logo.svg',
  },
};
const rolesConfig = {
  [roles.ROLE1]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE1'),
  [roles.ROLE2]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE2'),
  [roles.ROLE3]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE3'),
  [roles.ROLE4]: I18n.t('CONSTANTS.OPERATORS.ROLES.ROLE4'),
};

export { brands, departments, roles, brandsConfig, departmentsConfig, rolesConfig };
