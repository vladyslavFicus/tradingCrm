import keyMirror from 'keymirror';
import I18n from '../../../../../../utils/fake-i18n';

const types = keyMirror({
  FREE_SPIN: null,
  SPORTBET: null,
  OTHER: null,
  BONUS_ROUND_FREESPIN: null,
  BONUS_ROUND_BONUS: null,
  BONUS_ROUND_CHANCE: null,
  BONUS_ROUND_CARD: null,
});

const typesLabels = {
  [types.FREE_SPIN]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.FREE_SPIN'),
  [types.SPORTBET]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.SPORTBET'),
  [types.OTHER]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.OTHER'),
  [types.BONUS_ROUND_FREESPIN]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.BONUS_ROUND_FREESPIN'),
  [types.BONUS_ROUND_BONUS]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.BONUS_ROUND_BONUS'),
  [types.BONUS_ROUND_CHANCE]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.BONUS_ROUND_CHANCE'),
  [types.BONUS_ROUND_CARD]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.BONUS_ROUND_CARD'),
};

const typesProps = {
  [types.FREE_SPIN]: {
    className: 'game-round-type game-round-type_free-spin',
  },
  [types.SPORTBET]: {
    className: 'game-round-type game-round-type_sportbet',
  },
  [types.OTHER]: {
    className: 'game-round-type game-round-type_other',
  },
  [types.BONUS_ROUND_FREESPIN]: {
    className: 'game-round-type game-round-type_bonus-frespin',
  },
  [types.BONUS_ROUND_BONUS]: {
    className: 'game-round-type game-round-type_bonus-bonus',
  },
  [types.BONUS_ROUND_CHANCE]: {
    className: 'game-round-type game-round-type_bonus-chance',
  },
  [types.BONUS_ROUND_CARD]: {
    className: 'game-round-type game-round-type_bonus-card',
  },
};

export { types, typesLabels, typesProps };
