import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const moneyType = keyMirror({
  REAL_MONEY: null,
  BONUS_MONEY: null,
  REAL_AND_BONUS_MONEY: null,
});
const moneyTypeLabels = {
  [moneyType.REAL_MONEY]: I18n.t('CONSTANTS.GAMING_ACTIVITY.REAL_MONEY'),
  [moneyType.BONUS_MONEY]: I18n.t('CONSTANTS.GAMING_ACTIVITY.BONUS_MONEY'),
  [moneyType.REAL_AND_BONUS_MONEY]: I18n.t('CONSTANTS.GAMING_ACTIVITY.REAL_AND_BONUS_MONEY'),
};

export {
  moneyType,
  moneyTypeLabels,
};
