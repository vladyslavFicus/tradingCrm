import keyMirror from 'keymirror';

const moneyType = keyMirror({
  REAL_MONEY: null,
  BONUS_MONEY: null,
  REAL_AND_BONUS_MONEY: null,
});
const moneyTypeLabels = {
  [moneyType.REAL_MONEY]: 'Real money',
  [moneyType.BONUS_MONEY]: 'Bonus money',
  [moneyType.REAL_AND_BONUS_MONEY]: 'Real + Bonus money',
};

export {
  moneyType,
  moneyTypeLabels,
};
