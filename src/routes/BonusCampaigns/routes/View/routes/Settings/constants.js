import I18n from '../../../../../../utils/fake-i18n';

const attributeLabels = {
  name: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_NAME'),
  campaignPriority: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.PRIORITY'),
  moneyTypePriority: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MONEY_TYPE_PRIORITY'),
  targetType: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.TARGET_TYPE'),
  currency: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CURRENCY'),
  startDate: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.START_DATE'),
  endDate: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.END_DATE'),
  capping: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAPPING'),
  'capping.value': I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAPPING'),
  wagerWinMultiplier: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MULTIPLIER'),
  bonusLifetime: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.BONUS_LIFE_TIME'),
  campaignType: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_TYPE'),
  campaignRatio: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_RATIO'),
  'campaignRatio.value': I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_RATIO'),
  conversionPrize: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CONVERSION_PRIZE'),
  'conversionPrize.value': I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CONVERSION_PRIZE'),
  optIn: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.OPT_IN'),
  minAmount: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MIN_AMOUNT'),
  maxAmount: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MAX_AMOUNT'),
};

const attributePlaceholders = {
  minAmount: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MIN_AMOUNT_PLACEHOLDER'),
  maxAmount: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MAX_AMOUNT_PLACEHOLDER'),
};

export {
  attributeLabels,
  attributePlaceholders,
};
