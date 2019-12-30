import keyMirror from 'keymirror';

const brands = keyMirror({
  nasfx: null,
  terrafinance: null,
  '24newstrade': null,
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
  agmpsp: null,
  apf: null,
  kronosinvest: null,
  gladtotrade: null,
  rainbowgroupltd: null,
  snpbrokerpsp: null,
  virtualstocks: null,
  '7crypto': null,
  royalfunds: null,
  mycapital: null,
  wisefunds: null,
  aurumpro: null,
  creditwise: null,
  stockfunds: null,
  everfx: null,
  cryptobase: null,
  ecosales: null,
  dobby: null,
  topinvestus: null,
  topinvestuspsp: null,
  skycapital: null,
  skycapitals: null,
  globedemy: null,
  vetoro: null,
  mercuryo: null,
  stockfx: null,
  cmarket: null,
  fsaeverfx: null,
  '10cryptomarket': null,
  iconinvesting: null,
  royalsfx: null,
  capitalfunds: null,
  zurichtradefinco: null,
  cmgmarkets: null,
  dobbycysec: null,
  dobbycima: null,
  dobbyfsa: null,
  wexness: null
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
  [brands.terrafinance]: {
    name: 'Terra Finance',
    image: { src: '/img/brand/choose-brand/terrafinance.svg' },
  },
  [brands.trustfx]: {
    name: 'TrustFX',
    image: { src: '/img/brand/choose-brand/trustfx.svg' },
  },
  [brands.ifg]: {
    name: 'IFG',
    image: { src: '/img/brand/choose-brand/ifg.svg' },
  },
  [brands['24newstrade']]: {
    name: '24newstrade',
    image: { src: '/img/brand/choose-brand/24newstrade.svg' },
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
  [brands.agmpsp]: {
    name: 'Absolute GM PSP',
    image: { src: '/img/brand/choose-brand/agmpsp.svg' },
  },
  [brands.apf]: {
    name: 'Aurum PF',
    image: { src: '/img/brand/choose-brand/apf.svg' },
  },
  [brands.kronosinvest]: {
    name: 'Kronos Invest',
    image: { src: '/img/brand/choose-brand/kronosinvest.svg' },
  },
  [brands.gladtotrade]: {
    name: 'Glad2Trade',
    image: { src: '/img/brand/choose-brand/gladtotrade.svg' },
  },
  [brands.rainbowgroupltd]: {
    name: 'Rainbow Group LTD',
    image: { src: '/img/brand/choose-brand/rainbowgroupltd.svg' },
  },
  [brands.snpbrokerpsp]: {
    name: 'Snpbroker',
    image: { src: '/img/brand/choose-brand/snpbrokerpsp.svg' },
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
    name: 'Wise Funds',
    image: { src: '/img/brand/choose-brand/wisefunds.svg' },
  },
  [brands.aurumpro]: {
    name: 'Aurum Pro',
    image: { src: '/img/brand/choose-brand/aurumpro.svg' },
  },
  [brands.creditwise]: {
    name: 'Credit Wise',
    image: { src: '/img/brand/choose-brand/creditwise.svg' },
  },
  [brands.stockfunds]: {
    name: 'Stock Funds',
    image: { src: '/img/brand/choose-brand/stockfunds.svg' },
  },
  [brands.everfx]: {
    name: 'EverFX',
    image: { src: '/img/brand/choose-brand/everfx.svg' },
  },
  [brands.cryptobase]: {
    name: 'Cryptobase',
    image: { src: '/img/brand/choose-brand/cryptobase.svg' },
  },
  [brands.ecosales]: {
    name: 'Ecosales',
    image: { src: '/img/brand/choose-brand/ecosales.svg' },
  },
  [brands.dobby]: {
    name: 'Dobby',
    image: { src: '/img/brand/choose-brand/dobby.svg' },
  },
  [brands.topinvestus]: {
    name: 'Topinvestus.co',
    image: { src: '/img/brand/choose-brand/topinvestus.svg' },
  },
  [brands.topinvestuspsp]: {
    name: 'Topinvestus.com',
    image: { src: '/img/brand/choose-brand/topinvestuspsp.svg' },
  },
  [brands.globedemy]: {
    name: 'Globedemy',
    image: { src: '/img/brand/choose-brand/globedemy.svg' },
  },
  [brands.skycapitals]: {
    name: 'Skycapitals',
    image: { src: '/img/brand/choose-brand/skycapitals.svg' },
  },
  [brands.skycapitals]: {
    name: 'Skycapitals',
    image: { src: '/img/brand/choose-brand/skycapitals.svg' },
  },
  [brands.vetoro]: {
    name: 'Vetoro',
    image: { src: '/img/brand/choose-brand/vetoro.svg' },
  },
  [brands.mercuryo]: {
    name: 'Mercuryo',
    image: { src: '/img/brand/choose-brand/mercuryo.svg' },
  },
  [brands.stockfx]: {
    name: 'Stockfx',
    image: { src: '/img/brand/choose-brand/stockfx.svg' },
  },
  [brands.cmarket]: {
    name: 'Cmarket',
    image: { src: '/img/brand/choose-brand/cmarket.svg' },
  },
  [brands.fsaeverfx]: {
    name: 'FSA Everfx',
    image: { src: '/img/brand/choose-brand/fsaeverfx.svg' },
  },
  [brands['10cryptomarket']]: {
    name: '10cryptomarket',
    image: { src: '/img/brand/choose-brand/10cryptomarket.svg' },
  },
  [brands.iconinvesting]: {
    name: 'Icon Investing',
    image: { src: '/img/brand/choose-brand/iconinvesting.svg' },
  },
  [brands.royalsfx]: {
    name: 'Royalsfx',
    image: { src: '/img/brand/choose-brand/royalsfx.svg' },
  },
  [brands.capitalfunds]: {
    name: 'Capitalfunds',
    image: { src: '/img/brand/choose-brand/capitalfunds.svg' },
  },
  [brands.zurichtradefinco]: {
    name: 'Zurichtradefinco',
    image: { src: '/img/brand/choose-brand/zurichtradefinco.svg' },
  },
  [brands.cmgmarkets]: {
    name: 'Cmgmarkets',
    image: { src: '/img/brand/choose-brand/cmgmarkets.svg' },
  },
  [brands.dobbycysec]: {
    name: 'DobbyCysec',
    image: { src: '/img/brand/choose-brand/dobbycysec.svg' },
  },
  [brands.dobbycima]: {
    name: 'DobbyCima',
    image: { src: '/img/brand/choose-brand/dobbycima.svg' },
  },
  [brands.dobbyfsa]: {
    name: 'DobbyFsa',
    image: { src: '/img/brand/choose-brand/dobbyfsa.svg' },
  },
  [brands.wexness]: {
    name: 'Wexness',
    image: { src: '/img/brand/choose-brand/wexness.svg' },
  },
};
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

export { brands, departments, roles, brandsConfig, departmentsConfig, rolesConfig };
