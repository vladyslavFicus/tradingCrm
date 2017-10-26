import keyMirror from 'keymirror';
import I18n from '../../../../../../../../utils/fake-i18n';

const attributeLabels = {
  addReward: I18n.t('BONUS_CAMPAIGNS.SETTINGS.REWARDS.LABEL.ADD_REWARD'),
};

const nodeTypes = keyMirror({
  bonus: null,
});

const nodeTypesLabels = {
  [nodeTypes.bonus]: 'Bonus',
};

export {
  nodeTypes,
  nodeTypesLabels,
};

export default attributeLabels;
