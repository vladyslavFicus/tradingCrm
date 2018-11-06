import keyMirror from 'keymirror';

const statuses = keyMirror({
  PENDING: null,
  CREATED: null,
  FAILED: null,
  DISABLED: null,
  INACTIVE: null,
});

const moneyTypes = keyMirror({
  BONUS_MONEY: null,
  REAL_MONEY: null,
});

const moneyTypeLabels = {
  REAL_MONEY: 'CAMPAIGNS.MONEY_TYPE.LIST.REAL_MONEY',
  BONUS_MONEY: 'CAMPAIGNS.MONEY_TYPE.LIST.BONUS_MONEY',
};

export {
  moneyTypeLabels,
  statuses,
  moneyTypes,
};
