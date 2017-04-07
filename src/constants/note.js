import keyMirror from 'keymirror';

const targetTypes = keyMirror({
  PROFILE: null,
  BONUS: null,
  PAYMENT: null,
  FILE: null,
  LIMIT: null,
});

const targetTypesLabels = {
  [targetTypes.PROFILE]: 'Profile',
  [targetTypes.BONUS]: 'Bonus',
  [targetTypes.PAYMENT]: 'Payment',
  [targetTypes.FILE]: 'File',
  [targetTypes.LIMIT]: 'Limit',
};

export {
  targetTypes,
  targetTypesLabels,
};
