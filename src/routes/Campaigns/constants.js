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
  [rewardTemplateTypes.BONUS]: 'CAMPAIGNS.BONUS_TEMPLATE',
  [rewardTemplateTypes.FREE_SPIN]: 'CAMPAIGNS.FREE_SPIN_TEMPLATE',
};

const fulfilmentTypesLabels = {
  [fulfilmentTypes.WAGERING]: 'CAMPAIGNS.WAGERING_FULFILLMENT',
};

export {
  attributeLabels,
  rewardTemplateTypes,
  fulfilmentTypes,
  rewardTypesLabels,
  fulfilmentTypesLabels,
};

export default attributeLabels;
