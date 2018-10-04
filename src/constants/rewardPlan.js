import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const types = keyMirror({
  BONUS: null,
  CASH_BACK: null,
  RUNES: null,
  LOTTERY: null,
  FREE_SPINS: null,
});

const typesTitle = {
  [types.LOTTERY]: I18n.t('PROFILE.REWARD_PLAN.TITLE.LOTTERY'),
  [types.BONUS]: I18n.t('PROFILE.REWARD_PLAN.TITLE.BONUS'),
  [types.RUNES]: I18n.t('PROFILE.REWARD_PLAN.TITLE.RUNES'),
  [types.CASH_BACK]: I18n.t('PROFILE.REWARD_PLAN.TITLE.CASH_BACKS'),
  [types.FREE_SPINS]: I18n.t('PROFILE.REWARD_PLAN.TITLE.FREE_SPINS'),
};

const modalStaticData = {
  [types.LOTTERY]: {
    title: I18n.t('PROFILE.REWARD_PLAN.MODAL.LOTTERY.TITLE'),
    inputLabel: I18n.t('PROFILE.REWARD_PLAN.MODAL.LOTTERY.INPUT_LABEL'),
    actionText: I18n.t('PROFILE.REWARD_PLAN.MODAL.LOTTERY.ACTION_TEXT'),
  },
  [types.BONUS]: {
    title: I18n.t('PROFILE.REWARD_PLAN.MODAL.BONUS.TITLE'),
    inputLabel: I18n.t('PROFILE.REWARD_PLAN.MODAL.BONUS.INPUT_LABEL'),
    actionText: I18n.t('PROFILE.REWARD_PLAN.MODAL.BONUS.ACTION_TEXT'),
  },
  [types.RUNES]: {
    title: I18n.t('PROFILE.REWARD_PLAN.MODAL.RUNES.TITLE'),
    inputLabel: I18n.t('PROFILE.REWARD_PLAN.MODAL.RUNES.INPUT_LABEL'),
    actionText: I18n.t('PROFILE.REWARD_PLAN.MODAL.RUNES.ACTION_TEXT'),
  },
  [types.CASH_BACK]: {
    title: I18n.t('PROFILE.REWARD_PLAN.MODAL.CASH_BACKS.TITLE'),
    inputLabel: I18n.t('PROFILE.REWARD_PLAN.MODAL.CASH_BACKS.INPUT_LABEL'),
    actionText: I18n.t('PROFILE.REWARD_PLAN.MODAL.CASH_BACKS.ACTION_TEXT'),
  },
  [types.FREE_SPINS]: {
    title: I18n.t('PROFILE.REWARD_PLAN.MODAL.FREE_SPINS.TITLE'),
    inputLabel: I18n.t('PROFILE.REWARD_PLAN.MODAL.FREE_SPINS.INPUT_LABEL'),
    actionText: I18n.t('PROFILE.REWARD_PLAN.MODAL.FREE_SPINS.ACTION_TEXT'),
  },
};

export {
  types,
  typesTitle,
  modalStaticData,
};
