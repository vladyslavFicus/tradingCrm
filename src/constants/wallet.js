import keyMirror from 'keymirror';

const types = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
};
const actions = keyMirror({
  LOCK: null,
  UNLOCK: null,
});

export {
  actions,
  types,
};
