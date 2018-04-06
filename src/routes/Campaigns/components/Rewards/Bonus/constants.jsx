import keyMirror from 'keymirror';
import I18n from '../../../../../utils/fake-i18n';

const attributeLabels = {
  name: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.NAME'),
  bonusReward: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.BONUS_REWARD'),
  grant: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.GRANT'),
  capping: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.CAPPING'),
  multiplier: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MULTIPLIER'),
  moneyPrior: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MONEY_TYPE_PRIOR'),
  maxBet: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MAX_BET'),
  lifeTime: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.LIFE_TIME'),
  wageringRequirement: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.WAGERING_REQUIREMENT'),
  lockAmountStrategy: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.LOCK_AMOUNT_STRATEGY'),
};

const attributePlaceholders = {
  days: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.PLACEHOLDERS.DAYS'),
  notSet: I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.PLACEHOLDERS.NOT_SET'),
};

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
};
