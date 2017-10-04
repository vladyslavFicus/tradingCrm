import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const gameStatus = keyMirror({
  ACTIVE: null,
  INACTIVE: null,
});

const gameStatusLabels = {
  [gameStatus.ACTIVE]: I18n.t('COMMON.ACTIVE'),
  [gameStatus.INACTIVE]: I18n.t('COMMON.INACTIVE'),
};

const gameStatusColor = {
  [gameStatus.ACTIVE]: 'color-success',
  [gameStatus.INACTIVE]: 'color-danger',
};

export {
  gameStatus,
  gameStatusLabels,
  gameStatusColor,
};
