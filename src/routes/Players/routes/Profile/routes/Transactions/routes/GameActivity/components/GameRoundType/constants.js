import { gameRoundTypes } from '../../constants';
import I18n from '../../../../../../../../../../utils/fake-i18n';

const typesLabels = {
  [gameRoundTypes.ADJUSTMENT]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.ADJUSTMENT'),
  [gameRoundTypes.FREE_SPIN]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.FREE_SPIN'),
  [gameRoundTypes.SPORTBET]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.SPORTBET'),
  [gameRoundTypes.OTHER]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.OTHER'),
  [gameRoundTypes.BONUS_ROUND_FREESPIN]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.BONUS_ROUND_FREESPIN'),
  [gameRoundTypes.BONUS_ROUND_BONUS]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.BONUS_ROUND_BONUS'),
  [gameRoundTypes.BONUS_ROUND_CHANCE]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.BONUS_ROUND_CHANCE'),
  [gameRoundTypes.BONUS_ROUND_CARD]: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GAME_ROUND_TYPE.BONUS_ROUND_CARD'),
};

const typesProps = {
  [gameRoundTypes.ADJUSTMENT]: 'game-round-type_adjustment',
  [gameRoundTypes.FREE_SPIN]: 'game-round-type_free-spin',
  [gameRoundTypes.SPORTBET]: 'game-round-type_sportbet',
  [gameRoundTypes.OTHER]: 'game-round-type_other',
  [gameRoundTypes.BONUS_ROUND_FREESPIN]: 'game-round-type_bonus-freespin',
  [gameRoundTypes.BONUS_ROUND_BONUS]: 'game-round-type_bonus-bonus',
  [gameRoundTypes.BONUS_ROUND_CHANCE]: 'game-round-type_bonus-chance',
  [gameRoundTypes.BONUS_ROUND_CARD]: 'game-round-type_bonus-card',
};

export { typesLabels, typesProps };
