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

};

const attributePlaceholders = {
  days: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.PLACEHOLDERS.DAYS'),
  notSet: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.PLACEHOLDERS.NOT_SET'),
};

const GAME_TYPES = {
  DESKTOP: 'DESKTOP',
  MOBILE: 'MOBILE',
  DESKTOP_AND_MOBILE: 'DESKTOP_AND_MOBILE',
};

const wageringRequirementTypes = keyMirror({
  ABSOLUTE: null,
  BONUS: null,
  DEPOSIT: null,
  BONUS_PLUS_DEPOSIT: null,
});

const aggregatorsMap = {
  igromat: ['novomatic', 'igrosoft'],
  softgamings: ['betsoft', 'amaticdirect', 'habanero', 'netent'],
};

export {
  attributeLabels,
  attributePlaceholders,
  wageringRequirementTypes,
  aggregatorsMap,
  GAME_TYPES,
};
