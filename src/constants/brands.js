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
  iconinvesting: null,
  '10cryptomarket': null,
  goldmanbanc: null,
  royalsfx: null,
  capitalfunds: null,
  luxistrade: null,
  zurichtradefinco: null,
  cmgmarkets: null,
  dobbycysec: null,
  dobbycima: null,
  dobbyfsa: null,
  wexness: null,
  finansa: null,
  investogo: null,
  safedepositcentre: null,
  primefunder: null,
  firstfinancialbanc: null,
  marketsdock: null,
  primotrade: null,
  solidinvesting: null,
  finlay: null,
  thecapitalstocks: null,
  'bsb-global': null,
  fxrevolution: null,
  royaltyfinance: null,
  investactive: null,
  axedo: null,
  traderking: null,
  fxwlbrands: null,
  dax100fx: null,
  atlasfx: null,
  advinvesment: null,
  adamantfx: null,
  paragonfinance: null,
  'insure-trade': null,
  fxactiv: null,
  'energy-markets': null,
  lionstock: null,
  'bid-broker-stocks': null,
  bridgefund: null,
  investfd: null,
  stocklux: null,
  unitestock: null,
  finocapital: null,
  '24fintime': null,
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
  [brands.skycapital]: {
    name: 'Skycapital',
    image: { src: '/img/brand/choose-brand/skycapital.svg' },
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
  [brands.iconinvesting]: {
    name: 'Icon Investing',
    image: { src: '/img/brand/choose-brand/iconinvesting.svg' },
  },
  [brands['10cryptomarket']]: {
    name: '10cryptomarket',
    image: { src: '/img/brand/choose-brand/10cryptomarket.svg' },
  },
  [brands.goldmanbanc]: {
    name: 'Goldmanbanc',
    image: { src: '/img/brand/choose-brand/goldmanbanc.svg' },
  },
  [brands.royalsfx]: {
    name: 'Royalsfx',
    image: { src: '/img/brand/choose-brand/royalsfx.svg' },
  },
  [brands.capitalfunds]: {
    name: 'Capitalfunds',
    image: { src: '/img/brand/choose-brand/capitalfunds.svg' },
  },
  [brands.luxistrade]: {
    name: 'LuXisTrade',
    image: { src: '/img/brand/choose-brand/luxistrade.svg' },
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
    name: 'Dobby Cysec',
    image: { src: '/img/brand/choose-brand/dobbycysec.svg' },
  },
  [brands.dobbycima]: {
    name: 'Dobby Cima',
    image: { src: '/img/brand/choose-brand/dobbycima.svg' },
  },
  [brands.dobbyfsa]: {
    name: 'Dobby Fsa',
    image: { src: '/img/brand/choose-brand/dobbyfsa.svg' },
  },
  [brands.wexness]: {
    name: 'Wexness',
    image: { src: '/img/brand/choose-brand/wexness.svg' },
  },
  [brands.finansa]: {
    name: 'Finansa',
    image: { src: '/img/brand/choose-brand/finansa.svg' },
  },
  [brands.investogo]: {
    name: 'Investogo',
    image: { src: '/img/brand/choose-brand/investogo.svg' },
  },
  [brands.safedepositcentre]: {
    name: 'Safedepositcentre',
    image: { src: '/img/brand/choose-brand/safedepositcentre.svg' },
  },
  [brands.primefunder]: {
    name: 'Primefunder',
    image: { src: '/img/brand/choose-brand/primefunder.svg' },
  },
  [brands.firstfinancialbanc]: {
    name: 'Firstfinancialbanc',
    image: { src: '/img/brand/choose-brand/firstfinancialbanc.svg' },
  },
  [brands.marketsdock]: {
    name: 'Marketsdock',
    image: { src: '/img/brand/choose-brand/marketsdock.svg' },
  },
  [brands.primotrade]: {
    name: 'Primotrade',
    image: { src: '/img/brand/choose-brand/primotrade.svg' },
  },
  [brands.solidinvesting]: {
    name: 'Solidinvesting',
    image: { src: '/img/brand/choose-brand/solidinvesting.svg' },
  },
  [brands.finlay]: {
    name: 'Finlay',
    image: { src: '/img/brand/choose-brand/finlay.svg' },
  },
  [brands.thecapitalstocks]: {
    name: 'Thecapitalstocks',
    image: { src: '/img/brand/choose-brand/thecapitalstocks.svg' },
  },
  [brands['bsb-global']]: {
    name: 'bsb-global',
    image: { src: '/img/brand/choose-brand/bsb-global.svg' },
  },
  [brands.fxrevolution]: {
    name: 'Fxrevolution',
    image: { src: '/img/brand/choose-brand/fxrevolution.svg' },
  },
  [brands.royaltyfinance]: {
    name: 'Royaltyfinance',
    image: { src: '/img/brand/choose-brand/royaltyfinance.svg' },
  },
  [brands.investactive]: {
    name: 'Investactive',
    image: { src: '/img/brand/choose-brand/investactive.svg' },
  },
  [brands.axedo]: {
    name: 'Axedo',
    image: { src: '/img/brand/choose-brand/axedo.svg' },
  },
  [brands.traderking]: {
    name: 'Traderking',
    image: { src: '/img/brand/choose-brand/traderking.svg' },
  },
  [brands.fxwlbrands]: {
    name: 'FXwlbrands',
    image: { src: '/img/brand/choose-brand/fxwlbrands.svg' },
  },
  [brands.axedo]: {
    name: 'Axedo',
    image: { src: '/img/brand/choose-brand/axedo.svg' },
  },
  [brands.dax100fx]: {
    name: 'Dax100fx',
    image: { src: '/img/brand/choose-brand/dax100fx.svg' },
  },
  [brands.atlasfx]: {
    name: 'AtlasFX',
    image: { src: '/img/brand/choose-brand/atlasfx.svg' },
  },
  [brands.advinvesment]: {
    name: 'Adv-Invesment',
    image: { src: '/img/brand/choose-brand/advinvesment.svg' },
  },
  [brands.adamantfx]: {
    name: 'Adamantfx',
    image: { src: '/img/brand/choose-brand/adamantfx.svg' },
  },
  [brands.paragonfinance]: {
    name: 'Paragon-Finance',
    image: { src: '/img/brand/choose-brand/paragonfinance.svg' },
  },
  [brands['insure-trade']]: {
    name: 'insure-trade',
    image: { src: '/img/brand/choose-brand/insure-trade.svg' },
  },
  [brands.fxactiv]: {
    name: 'fxactiv',
    image: { src: '/img/brand/choose-brand/fxactiv.svg' },
  },
  [brands['energy-markets']]: {
    name: 'energy-markets',
    image: { src: '/img/brand/choose-brand/energy-markets.svg' },
  },
  [brands.lionstock]: {
    name: 'lionstock',
    image: { src: '/img/brand/choose-brand/lionstock.svg' },
  },
  [brands['bid-broker-stocks']]: {
    name: 'bid-broker-stocks',
    image: { src: '/img/brand/choose-brand/bid-broker-stocks.svg' },
  },
  [brands.bridgefund]: {
    name: 'bridgefund',
    image: { src: '/img/brand/choose-brand/bridgefund.svg' },
  },
  [brands.investfd]: {
    name: 'investfd',
    image: { src: '/img/brand/choose-brand/investfd.svg' },
  },
  [brands.stocklux]: {
    name: 'stocklux',
    image: { src: '/img/brand/choose-brand/stocklux.svg' },
  },
  [brands.unitestock]: {
    name: 'unitestock',
    image: { src: '/img/brand/choose-brand/unitestock.svg' },
  },
  [brands.finocapital]: {
    name: 'finocapital',
    image: { src: '/img/brand/choose-brand/finocapital.svg' },
  },
  [brands['24fintime']]: {
    name: '24fintime',
    image: { src: '/img/brand/choose-brand/24fintime.svg' },
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
