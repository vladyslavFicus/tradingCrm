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

const withLines = keyMirror({
  AVAILABLE: null,
  UNAVAILABLE: null,
});

const withLinesLabels = {
  [withLines.AVAILABLE]: I18n.t('GAMES.GRID.FREE_SPINS_AVAILABLE'),
  [withLines.UNAVAILABLE]: I18n.t('GAMES.GRID.FREE_SPINS_UNAVAILABLE'),
};

const type = keyMirror({
  MOBILE: null,
  DESKTOP: null,
});

const typeLabels = {
  [type.MOBILE]: I18n.t('GAMES.MOBILE'),
  [type.DESKTOP]: I18n.t('GAMES.DESKTOP'),
};

const gameProvider = keyMirror({
  microgaming: null,
  greentube: null,
  netent: null,
  igromat: null,
  stakelogic: null,
});

const gameProviderLabels = {
  [gameProvider.microgaming]: I18n.t('GAMES.MICROGAMING'),
  [gameProvider.greentube]: I18n.t('GAMES.GREENTUBE'),
  [gameProvider.netent]: I18n.t('GAMES.NETENT'),
  [gameProvider.stakelogic]: I18n.t('GAMES.STAKELOGIC'),
};

export {
  gameStatus,
  gameStatusLabels,
  gameStatusColor,
  withLines,
  withLinesLabels,
  type,
  typeLabels,
  gameProvider,
  gameProviderLabels,
};
