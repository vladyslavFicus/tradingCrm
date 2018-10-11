import keyMirror from 'keymirror';
import I18n from '../../../../../utils/fake-i18n';

const attributeLabels = {
  aggregationType: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.AGGREGATION_TYPE.LABEL'),
  moneyType: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.MONEY_TYPE.LABEL'),
  spinType: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.SPIN_TYPE.LABEL'),
  roundType: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.ROUND_TYPE.LABEL'),
  amount: I18n.t('COMMON.AMOUNT'),
  minSum: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.MIN_SUM.LABEL'),
  gameFilter: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.GAME_FILTER.LABEL'),
  gameList: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.GAME_LIST.LABEL'),
};

const aggregationTypes = keyMirror({
  COUNT: null,
  SUM: null,
  INROWCOUNT: null,
});

const aggregationTypeLabels = {
  [aggregationTypes.COUNT]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.AGGREGATION_TYPE.VALUES.COUNT'),
  [aggregationTypes.SUM]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.AGGREGATION_TYPE.VALUES.SUM'),
  [aggregationTypes.INROWCOUNT]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.AGGREGATION_TYPE.VALUES.INROWCOUNT'),
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

const roundTypes = keyMirror({
  SPIN: null,
  BONUS_ROUND_CHANCE: null,
});

const roundTypeLabels = {
  [roundTypes.SPIN]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.SPIN_TYPE.VALUES.SPIN'),
  [roundTypes.BONUS_ROUND_CHANCE]: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.GAMING.SPIN_TYPE.VALUES.BONUS_ROUND_CHANCE'),
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
  roundTypes,
  gameFilters,
  aggregationTypeLabels,
  moneyTypeLabels,
  spinTypeLabels,
  roundTypeLabels,
  gameFilterLabels,
  attributeLabels,
};
