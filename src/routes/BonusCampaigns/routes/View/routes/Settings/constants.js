import keyMirror from 'keymirror';
import I18n from '../../../../../../utils/fake-i18n';

const attributeLabels = {
  campaignName: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_NAME'),
  campaignPriority: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.PRIORITY'),
  targetType: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.TARGET_TYPE'),
  currency: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CURRENCY'),
  startDate: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.START_DATE'),
  endDate: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.END_DATE'),
  capping: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAPPING'),
  'capping.value': I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAPPING'),
  campaignType: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_TYPE'),
  campaignRatio: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_RATIO'),
  conversionPrize: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CONVERSION_PRIZE'),
  'conversionPrize.value': I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CONVERSION_PRIZE'),
  optIn: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.OPT_IN'),
  registrationFulfillment: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.REGISTRATION_FULFILLMENT'),
  depositFulfillment: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.DEPOSIT_FULFILLMENT'),
  wageringFulfillment: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.WAGERING_FULFILLMENT'),
  loginFulfillment: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.LOGIN_FULFILLMENT'),
  campaignFulfillment: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.CAMPAIGN_FULFILLMENT'),
  emailVerificationFulfillment: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.EMAIL_VERIFICATION_FULFILLMENT'),
  phoneVerificationFulfillment: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.PHONE_VERIFICATION_FULFILLMENT'),
  addReward: I18n.t('BONUS_CAMPAIGNS.REWARDS.ADD_REWARD'),
  'fulfillments.deposit.minAmount': I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.DEPOSIT.MIN_AMOUNT'),
  'fulfillments.deposit.maxAmount': I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.DEPOSIT.MAX_AMOUNT'),
  'fulfillments.deposit.lockAmountStrategy': I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.DEPOSIT.LOCK_AMOUNT_STRATEGY'),
  'rewards.bonus.campaignRatio.value': I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.CAMPAIGN_RATIO.VALUE'),
  'rewards.bonus.campaignRatio.type': I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.CAMPAIGN_RATIO.TYPE'),
  'rewards.bonus.wagerWinMultiplier': I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.MULTIPLIER'),
  'rewards.bonus.bonusLifetime ': I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.BONUS_LIFE_TIME'),
  'rewards.bonus.moneyTypePriority ': I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS.MONEY_TYPE_PRIORITY'),
};

const nodeGroupTypes = keyMirror({
  fulfillments: null,
  rewards: null,
});

const attributePlaceholders = {
  minAmount: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MIN_AMOUNT_PLACEHOLDER'),
  maxAmount: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MAX_AMOUNT_PLACEHOLDER'),
};

export {
  attributeLabels,
  nodeGroupTypes,
  attributePlaceholders,
};

export default attributeLabels;
