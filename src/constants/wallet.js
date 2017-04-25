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
const reasons = {
  [actions.LOCK]: [
    'REASON_ONE',
    'REASON_TWO',
    'REASON_THREE',
    'REASON_FOUR',
  ],
  [actions.UNLOCK]: [
    'UNLOCK_REASON_ONE',
    'UNLOCK_REASON_TWO',
    'UNLOCK_REASON_THREE',
    'UNLOCK_REASON_FOUR',
  ],
};

export {
  actions,
  authors,
  types,
  reasons,
};
