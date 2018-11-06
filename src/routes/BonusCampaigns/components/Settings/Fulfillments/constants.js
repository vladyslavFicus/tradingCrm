import keyMirror from 'keymirror';
import I18n from '../../../../../utils/fake-i18n';

const attributeLabels = {
  addFulfillment: I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENT.LABEL.ADD_FULFILLMENT'),
  selectFulfillment: I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENT.SELECT_FULFILLMENT'),
};

const nodeTypes = keyMirror({
  deposit: null,
  profileCompleted: null,
  noFulfillments: null,
});

const nodeTypesLabels = {
  [nodeTypes.deposit]: I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENT.DEPOSIT.LABEL'),
  [nodeTypes.profileCompleted]: I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENT.PROFILE_COMPLETED.LABEL'),
  [nodeTypes.noFulfillments]: I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENT.NO_FULFILLMENTS.LABEL'),
};


export {
  nodeTypes,
  nodeTypesLabels,
};

export default attributeLabels;
