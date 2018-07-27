import keyMirror from 'keymirror';
import I18n from '../../../../utils/fake-i18n';

const attributeLabels = {
  deviceType: I18n.t('CAMPAIGNS.REWARDS.FREE_SPIN.DEVICE_TYPE'),
  chooseDeviceType: I18n.t('CAMPAIGNS.REWARDS.CHOOSE_DEVICE_TYPE'),
};

const deviceTypes = keyMirror({
  ALL: null,
  MOBILE: null,
  DESKTOP: null,
});

const deviceTypesLabels = {
  [deviceTypes.ALL]: I18n.t('CAMPAIGNS.REWARDS.DEVICE_TYPE.ALL'),
  [deviceTypes.MOBILE]: I18n.t('CAMPAIGNS.REWARDS.DEVICE_TYPE.MOBILE'),
  [deviceTypes.DESKTOP]: I18n.t('CAMPAIGNS.REWARDS.DEVICE_TYPE.DESKTOP'),
};

export {
  attributeLabels,
  deviceTypes,
  deviceTypesLabels,
};
