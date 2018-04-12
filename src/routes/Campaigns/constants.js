import keyMirror from 'keymirror';
import I18n from '../../utils/fake-i18n';

const attributeLabels = {
  campaignName: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_NAME'),
};

const rewardTypes = keyMirror({
  BONUS: null,
  FREE_SPIN: null,
});

const fulfilmentTypes = keyMirror({
  WAGERING: null,
});

const rewardTypesLabels = {
  [rewardTypes.BONUS]: 'Bonus',
  [rewardTypes.FREE_SPIN]: 'Free spin',
};

const fulfilmentTypesLabels = {
  [fulfilmentTypes.WAGERING]: 'Wagering',
};

export {
  attributeLabels,
  rewardTypes,
  fulfilmentTypes,
  rewardTypesLabels,
  fulfilmentTypesLabels,
};

export default attributeLabels;
