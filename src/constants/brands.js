import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const brands = keyMirror({
  nasfx: null,
  cryptomb: null,
  bycrypto: null,
  snpbrokers: null,
  rbctrade: null,
  cryptobull: null,
  royalbanc: null,
  '365gcc': null,
  finaxis: null,
  finfuture: null,
  investlead: null,
  fxnobel: null,
  fxnobels: null,
  finanalytics: null,
  ptbanc: null,
  trustfx: null,
  ifg: null,
  alliancecapital: null,
  everfxglobal: null,
  everfxcn: null,
  agm: null,
  apf: null,
  kronosinvest: null,
  glad2trade: null,
  rainbowgroupltd: null,
  snpbroker: null,
  virtualstocks: null,
  '7crypto': null,
  royalfunds: null,
  mycapital: null,
  wisefunds: null,
  aurumpro: null,
});

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
  [brands.cryptobull]: {
    name: 'Crypto-bull',
    image: { src: '/img/brand/choose-brand/cryptobull.svg' },
  },
  [brands.royalbanc]: {
    name: 'Royalbanc',
    image: { src: '/img/brand/choose-brand/royalbanc.svg' },
  },
  [brands['365gcc']]: {
    name: '365gcc',
    image: { src: '/img/brand/choose-brand/365gcc.svg' },
  },
  [brands.finaxis]: {
    name: 'Finaxis',
    image: { src: '/img/brand/choose-brand/finaxis.svg' },
  },
  [brands.finfuture]: {
    name: 'Finfuture',
    image: { src: '/img/brand/choose-brand/finfuture.svg' },
  },
  [brands.investlead]: {
    name: 'Investlead',
    image: { src: '/img/brand/choose-brand/investlead.svg' },
  },
  [brands.fxnobel]: {
    name: 'FXnobel',
    image: { src: '/img/brand/choose-brand/fxnobel.svg' },
  },
  [brands.fxnobels]: {
    name: 'FXnobels',
    image: { src: '/img/brand/choose-brand/fxnobels.svg' },
  },
  [brands.finanalytics]: {
    name: 'FinAnalytics',
    image: { src: '/img/brand/choose-brand/finanalytics.svg' },
  },
  [brands.ptbanc]: {
    name: 'PTbanc',
    image: { src: '/img/brand/choose-brand/ptbanc.svg' },
  },
  [brands.trustfx]: {
    name: 'TrustFX',
    image: { src: '/img/brand/choose-brand/trustfx.svg' },
  },
  [brands.ifg]: {
    name: 'IFG',
    image: { src: '/img/brand/choose-brand/ifg.svg' },
  },
  [brands.alliancecapital]: {
    name: 'Alliance Capital',
    image: { src: '/img/brand/choose-brand/alliancecapital.svg' },
  },
  [brands.everfxglobal]: {
    name: 'EverFX Global',
    image: { src: '/img/brand/choose-brand/everfxglobal.svg' },
  },
  [brands.everfxcn]: {
    name: 'EverFX CN',
    image: { src: '/img/brand/choose-brand/everfxcn.svg' },
  },
  [brands.agm]: {
    name: 'Absolute GM',
    image: { src: '/img/brand/choose-brand/agm.svg' },
  },
  [brands.apf]: {
    name: 'Aurum PF',
    image: { src: '/img/brand/choose-brand/apf.svg' },
  },
  [brands.kronosinvest]: {
    name: 'Kronos Invest',
    image: { src: '/img/brand/choose-brand/kronosinvest.svg' },
  },
  [brands.glad2trade]: {
    name: 'Glad2Trade',
    image: { src: '/img/brand/choose-brand/glad2trade.svg' },
  },
  [brands.rainbowgroupltd]: {
    name: 'Rainbow Group LTD',
    image: { src: '/img/brand/choose-brand/rainbowgroupltd.svg' },
  },
  [brands.snpbroker]: {
    name: 'Snpbroker',
    image: { src: '/img/brand/choose-brand/snpbroker.svg' },
  },
  [brands.virtualstocks]: {
    name: 'Virtual Stocks',
    image: { src: '/img/brand/choose-brand/virtualstocks.svg' },
  },
  [brands['7crypto']]: {
    name: '7crypto',
    image: { src: '/img/brand/choose-brand/7crypto.svg' },
  },
  [brands.royalfunds]: {
    name: 'Royal Funds',
    image: { src: '/img/brand/choose-brand/royalfunds.svg' },
  },
  [brands.mycapital]: {
    name: 'Mycapital',
    image: { src: '/img/brand/choose-brand/mycapital.svg' },
  },
  [brands.wisefunds]: {
    name: 'Wisefunds',
    image: { src: '/img/brand/choose-brand/wisefunds.svg' },
  },
  [brands.rainbowgroupltd]: {
    name: 'AurumPro',
    image: { src: '/img/brand/choose-brand/aurumpro.svg' },
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
