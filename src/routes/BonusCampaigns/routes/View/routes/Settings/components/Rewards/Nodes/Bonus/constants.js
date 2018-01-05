import I18n from '../../../../../../../../../../utils/fake-i18n';

const attributeLabels = {
  bonusReward: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.BONUS_REWARD'),
  grant: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.GRANT'),
  limits: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.LIMITS'),
  multiplier: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.MULTIPLIER'),
  multipliersType: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.MULTIPLIERS_TYPE'),
  moneyPrior: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.MONEY_TYPE_PRIOR'),
  lifeTime: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.LIFE_TIME'),
};

const attributePlaceholders = {
  days: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.PLACEHOLDERS.DAYS'),
  notSet: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.PLACEHOLDERS.NOT_SET'),
};

export {
  attributeLabels,
  attributePlaceholders,
};
