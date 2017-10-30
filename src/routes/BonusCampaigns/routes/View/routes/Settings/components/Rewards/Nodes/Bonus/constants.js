import I18n from '../../../../../../../../../../utils/fake-i18n';

const attributeLabels = {
  bonusReward: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS_REWARD'),
  grant: I18n.t('BONUS_CAMPAIGNS.REWARDS.GRANT'),
  limits: I18n.t('BONUS_CAMPAIGNS.REWARDS.LIMITS'),
  multiplier: I18n.t('BONUS_CAMPAIGNS.REWARDS.MULTIPLIER'),
  multipliersType: I18n.t('BONUS_CAMPAIGNS.REWARDS.MULTIPLIERS_TYPE'),
  moneyPrior: I18n.t('BONUS_CAMPAIGNS.REWARDS.MONEY_TYPE_PRIOR'),
  bmBetLimit: I18n.t('BONUS_CAMPAIGNS.REWARDS.BM_BET_LIMIT'),
  lifeTime: I18n.t('BONUS_CAMPAIGNS.REWARDS.LIFE_TIME'),
  customContribRate: I18n.t('BONUS_CAMPAIGNS.REWARDS.CUSTOM_CONTRIB_RATE'),
};

const attributePlaceholders = {
  days: I18n.t('BONUS_CAMPAIGNS.REWARDS.PLACEHOLDERS.DAYS'),
  notSet: I18n.t('BONUS_CAMPAIGNS.REWARDS.PLACEHOLDERS.NOT_SET'),
};

export {
  attributeLabels,
  attributePlaceholders,
};
