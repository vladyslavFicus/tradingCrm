import I18n from '../../../../../../../../../../utils/fake-i18n';

const attributeLabels = {
  name: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.NAME'),
  bonusReward: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.BONUS_REWARD'),
  grant: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.GRANT'),
  limits: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.LIMITS'),
  multiplier: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MULTIPLIER'),
  multipliersType: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MULTIPLIERS_TYPE'),
  moneyPrior: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MONEY_TYPE_PRIOR'),
  lifeTime: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.LIFE_TIME'),
  maxBet: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MAX_BET'),
  maxGrantedAmount: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MAX_GRANTED_AMOUNT'),
  maxGrantAmount: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MAX_GRANTED_AMOUNT'),
  template: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.TEMPLATE'),
  wageringRequirement: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.WAGERING_REQUIREMENT'),
  lockAmountStrategy: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.LOCK_AMOUNT_STRATEGY'),
  capping: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.CAPPING'),
  prize: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.PRIZE'),
};

const attributePlaceholders = {
  days: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.PLACEHOLDERS.DAYS'),
  notSet: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.PLACEHOLDERS.NOT_SET'),
};

export {
  attributeLabels,
  attributePlaceholders,
};
