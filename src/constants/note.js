import keyMirror from 'keymirror';

const targetTypes = keyMirror({
  PROFILE: null,
  BONUS: null,
  PAYMENT: null,
  FILE: null,
  LIMIT: null,
  PAYMENT_ACCOUNT: null,
});

const targetTypesLabels = {
  [targetTypes.PROFILE]: 'Profile',
  [targetTypes.BONUS]: 'Bonus',
  [targetTypes.PAYMENT]: 'Payment',
  [targetTypes.FILE]: 'File',
  [targetTypes.LIMIT]: 'Limit',
  [targetTypes.PAYMENT_ACCOUNT]: 'Payment Account',
};

export {
  targetTypes,
  targetTypesLabels,
};
