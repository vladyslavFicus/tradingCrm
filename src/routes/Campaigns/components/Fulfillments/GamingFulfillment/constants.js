import keyMirror from 'keymirror';
import I18n from '../../../../../utils/fake-i18n';

const attributeLabels = {
  aggregationType: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.AGGREGATION_TYPE.LABEL'),
  moneyType: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.MONEY_TYPE.LABEL'),
  spinType: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.SPIN_TYPE.LABEL'),
  amount: I18n.t('COMMON.AMOUNT'),
  gameFilter: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.GAME_FILTER.LABEL'),
  gameList: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.GAME_LIST.LABEL'),
};

const aggregationTypes = keyMirror({
  COUNT: null,
  SUM: null,
});

const aggregationTypeLabels = {
  [aggregationTypes.COUNT]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.AGGREGATION_TYPE.VALUES.COUNT'),
  [aggregationTypes.SUM]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.AGGREGATION_TYPE.VALUES.SUM'),
};

const moneyTypes = keyMirror({
  ALL: null,
  REAL: null,
  BONUS: null,
});

const moneyTypeLabels = {
  [moneyTypes.ALL]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.MONEY_TYPE.VALUES.ALL'),
  [moneyTypes.REAL]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.MONEY_TYPE.VALUES.REAL'),
  [moneyTypes.BONUS]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.MONEY_TYPE.VALUES.BONUS'),
};

const spinTypes = keyMirror({
  BET: null,
  WIN: null,
});

const spinTypeLabels = {
  [spinTypes.BET]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.SPIN_TYPE.VALUES.BET'),
  [spinTypes.WIN]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.SPIN_TYPE.VALUES.WIN'),
};

const gameFilters = keyMirror({
  ALL: null,
  PROVIDER: null,
  CUSTOM: null,
});

const gameFilterLabels = {
  [gameFilters.ALL]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.GAME_FILTER.VALUES.ALL'),
  [gameFilters.PROVIDER]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.GAME_FILTER.VALUES.PROVIDER'),
  [gameFilters.CUSTOM]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.GAME_FILTER.VALUES.CUSTOM'),
};

export {
  aggregationTypes,
  moneyTypes,
  spinTypes,
  gameFilters,
  aggregationTypeLabels,
  moneyTypeLabels,
  spinTypeLabels,
  gameFilterLabels,
  attributeLabels,
};
