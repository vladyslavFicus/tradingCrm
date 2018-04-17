import keyMirror from 'keymirror';
import I18n from '../../utils/fake-i18n';

const attributeLabels = {
  campaignName: I18n.t('CAMPAIGNS.CAMPAIGN_NAME'),
};

const rewardTemplateTypes = keyMirror({
  BONUS: null,
  FREE_SPIN: null,
});

const fulfilmentTypes = keyMirror({
  WAGERING: null,
  DEPOSIT: null,
});

const rewardTypesLabels = {
  [rewardTemplateTypes.BONUS]: I18n.t('CAMPAIGNS.BONUS_TEMPLATE'),
  [rewardTemplateTypes.FREE_SPIN]: I18n.t('CAMPAIGNS.FREE_SPIN_TEMPLATE'),
};

const fulfilmentTypesLabels = {
  [fulfilmentTypes.WAGERING]: I18n.t('CAMPAIGNS.WAGERING_FULFILLMENT'),
  [fulfilmentTypes.DEPOSIT]: I18n.t('CAMPAIGNS.DEPOSIT_FULFILLMENT'),
};

export {
  attributeLabels,
  rewardTemplateTypes,
  fulfilmentTypes,
  rewardTypesLabels,
  fulfilmentTypesLabels,
};

export default attributeLabels;
