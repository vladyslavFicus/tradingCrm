import keyMirror from 'keymirror';
import I18n from '../../../../../../../utils/fake-i18n';

const attributeLabels = {
  lifeTime: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.LIFE_TIME'),
  providerId: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.PROVIDER'),
  aggregatorId: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.AGGREGATOR'),
  gameId: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.GAMES'),
  gameType: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.GAME_TYPE'),
  name: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.NAME'),
  freeSpins: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.FREE_SPINS'),
  freeSpinReward: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.FREE_SPIN_REWARD'),
  betPerLine: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.BET_PER_LINE'),
  template: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.TEMPLATE'),
  prize: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.PRIZE'),
  wagering: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.WAGERING'),
  capping: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.CAPPING'),
  moneyPriority: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.MONEY_PRIORITY'),
  spinValue: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.SPIN_VALUE'),
  totalValue: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.TOTAL_VALUE'),
  maxBet: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.MAX_BET'),
  count: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.COUNT'),
  pageCode: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.PAGE_CODE'),
  betLevel: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.BET_LEVEL'),
  comment: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.COMMENT'),
  betMultiplier: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.BET_MULTIPLIER'),
  coinSize: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.COIN_SIZE'),
  rhfpBet: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.RHFP_BET'),
  freeSpinLifeTime: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN_LIFE_TIME'),
};

const attributePlaceholders = {
  days: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.PLACEHOLDERS.DAYS'),
  notSet: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.PLACEHOLDERS.NOT_SET'),
};

const GAME_TYPES = keyMirror({
  DESKTOP: null,
  MOBILE: null,
  DESKTOP_AND_MOBILE: null,
});

const HARDCODED_PROVIDERS = [
  'netent',
  'betsoft',
  'amaticdirect',
  'habanero',
];

const wageringRequirementTypes = keyMirror({
  ABSOLUTE: null,
  BONUS: null,
  DEPOSIT: null,
  BONUS_PLUS_DEPOSIT: null,
});

export {
  attributeLabels,
  attributePlaceholders,
  wageringRequirementTypes,
  GAME_TYPES,
  HARDCODED_PROVIDERS,
};
