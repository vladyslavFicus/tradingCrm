import keyMirror from 'keymirror';

const actions = keyMirror({
  LOCK: null,
  UNLOCK: null,
});
const authors = {
  OPERATOR: 'operator',
  PROFILE: 'profile',
  BONUS: 'bonus',
};
const types = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
};

export {
  actions,
  authors,
  types,
};
