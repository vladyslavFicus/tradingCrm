import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const types = keyMirror({
  LOTTERY: null,
  BONUS: null,
  RUNES: null,
  CASH_BACKS: null,
  FREE_SPINS: null,
});

const typesKeys = {
  [types.LOTTERY]: 'lottery',
  [types.BONUS]: 'bonus',
  [types.RUNES]: 'runes',
  [types.CASH_BACKS]: 'cashBacks',
  [types.FREE_SPINS]: 'freeSpins',
};

const typesTitle = {
  [types.LOTTERY]: I18n.t('LOTTERY'),
  [types.BONUS]: I18n.t('BONUS'),
  [types.RUNES]: I18n.t('RUNES'),
  [types.CASH_BACKS]: I18n.t('CASH_BACKS'),
  [types.FREE_SPINS]: I18n.t('FREE_SPINS'),
};

const modalStaticData = {
  [types.LOTTERY]: {
    title: 'Pending lottery tickets payout',
    inputLabel: 'Lottery amount',
    actionText: 'You are about to amend pending lottery tickets payout',
  },
  [types.BONUS]: {
    title: 'Pending bonus payout',
    inputLabel: 'Bonus amount',
    actionText: 'You are about to amend pending bonus payout',
  },
  [types.RUNES]: {
    title: 'Loyalty points',
    inputLabel: 'Loyalty Points',
    actionText: 'You are about to amend loyalty points',
  },
  [types.CASH_BACKS]: {
    title: 'Pending cashback payout',
    inputLabel: 'Cashback amount',
    actionText: 'You are about to amend pending cashback payout',
  },
  [types.FREE_SPINS]: {
    title: 'Pending freespins payout',
    inputLabel: 'Freespins amount',
    actionText: 'You are about to amend pending freespins payout',
  },
};

export {
  types,
  typesKeys,
  typesTitle,
  modalStaticData,
};
